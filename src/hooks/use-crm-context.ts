import { useState, useEffect, useCallback } from 'react';
import { exportToCSV, exportToExcel, exportToPDF, importFromCSV, printData } from '../utils/crm-data-operations';

// Types pour le contexte CRM global
interface CRMContextState {
  lastSync: Date;
  isRefreshing: boolean;
  companyName: string;
  activeModules: string[];
  syncDataAcrossCRM: () => void;
  updateModuleData: (moduleName: string, data: any) => void;
  getModuleData: (moduleName: string) => any;
  exportModuleData: (moduleName: string, format: 'csv' | 'excel' | 'pdf', customData?: any[]) => Promise<boolean>;
  importModuleData: (moduleName: string, file: File) => Promise<boolean>;
  printModuleData: (moduleName: string, options?: any) => Promise<boolean>;
}

// Custom hook to manage global CRM context
export const useCRMContext = (): CRMContextState => {
  const [lastSync, setLastSync] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [moduleData, setModuleData] = useState<Record<string, any>>({
    parcelles: {
      items: [
        { id: 1, nom: "North Parcel", surface: 12.5, culture: "Sugarcane", statut: "In growth" },
        { id: 2, nom: "South Parcel", surface: 8.3, culture: "Banana", statut: "Harvesting" },
        { id: 3, nom: "East Parcel", surface: 5.2, culture: "Pineapple", statut: "Preparation" }
      ],
      columns: [
        { key: "id", header: "ID" },
        { key: "nom", header: "Name" },
        { key: "surface", header: "Area (ha)" },
        { key: "culture", header: "Crop" },
        { key: "statut", header: "Status" }
      ]
    },
    cultures: {
      items: [
        { id: 1, nom: "Sugarcane", variete: "R579", dateDebut: "2023-03-15", dateFin: "2024-03-15" },
        { id: 2, nom: "Banana", variete: "Grande Naine", dateDebut: "2023-02-10", dateFin: "2023-12-10" },
        { id: 3, nom: "Pineapple", variete: "MD-2", dateDebut: "2023-05-05", dateFin: "2024-06-01" }
      ],
      columns: [
        { key: "id", header: "ID" },
        { key: "nom", header: "Crop" },
        { key: "variete", header: "Variety" },
        { key: "dateDebut", header: "Start date" },
        { key: "dateFin", header: "End date" }
      ]
    },
    finances: {
      items: [
        { id: 1, type: "revenu", montant: 15000, description: "Sugarcane harvest sale", date: "2023-06-15" },
        { id: 2, type: "depense", montant: 5000, description: "Fertilizer purchase", date: "2023-05-10" },
        { id: 3, type: "revenu", montant: 8500, description: "Banana sales", date: "2023-07-20" }
      ],
      columns: [
        { key: "id", header: "ID" },
        { key: "date", header: "Date" },
        { key: "type", header: "Type" },
        { key: "description", header: "Description" },
        { key: "montant", header: "Amount (€)" }
      ]
    },
    statistiques: {
      items: [
        { periode: "2023-T1", cultureId: 1, rendement: 8.2, revenus: 12500, couts: 4200 },
        { periode: "2023-T2", cultureId: 1, rendement: 8.5, revenus: 13000, couts: 4100 },
        { periode: "2023-T1", cultureId: 2, rendement: 15.3, revenus: 7800, couts: 2100 }
      ],
      columns: [
        { key: "periode", header: "Period" },
        { key: "cultureId", header: "Culture ID" },
        { key: "rendement", header: "Yield (t/ha)" },
        { key: "revenus", header: "Revenue (€)" },
        { key: "couts", header: "Costs (€)" }
      ]
    },
    inventaire: {
      items: [
        { id: 1, nom: "NPK Fertilizer", categorie: "Inputs", quantite: 500, unite: "kg", prix: 2.5 },
        { id: 2, nom: "Organic Pesticide", categorie: "Inputs", quantite: 50, unite: "L", prix: 18.75 },
        { id: 3, nom: "Tractor", categorie: "Equipment", quantite: 2, unite: "units", prix: 25000 }
      ],
      columns: [
        { key: "id", header: "ID" },
        { key: "nom", header: "Name" },
        { key: "categorie", header: "Category" },
        { key: "quantite", header: "Quantity" },
        { key: "unite", header: "Unit" },
        { key: "prix", header: "Unit price (€)" }
      ]
    }
  });
  const [activeModules, setActiveModules] = useState<string[]>([
    'parcelles',
    'cultures',
    'finances',
    'statistiques',
    'inventaire'
  ]);
  
  // Company name
  const companyName = 'Agri Dom';

  // Data synchronization across all CRM modules
  const syncDataAcrossCRM = useCallback(() => {
    setIsRefreshing(true);
    
    // Simuler un temps de synchronisation
    setTimeout(() => {
      setLastSync(new Date());
      setIsRefreshing(false);
    }, 1500);
  }, []);

  // Update data for a specific module
  const updateModuleData = useCallback((moduleName: string, data: any) => {
    setModuleData(prevData => ({
      ...prevData,
      [moduleName]: {
        ...prevData[moduleName],
        ...data
      }
    }));
    
    // Update last synchronization date
    setLastSync(new Date());
  }, []);

  // Get data for a specific module
  const getModuleData = useCallback((moduleName: string) => {
    return moduleData[moduleName] || {};
  }, [moduleData]);

  // Export module data to specified format
  const exportModuleData = useCallback(async (
    moduleName: string, 
    format: 'csv' | 'excel' | 'pdf',
    customData?: any[]
  ): Promise<boolean> => {
    // Use custom data if provided, otherwise get from module
    const data = customData || getModuleData(moduleName)?.items;
    
    if (!data || !Array.isArray(data) || data.length === 0) {
      return false;
    }
    
    try {
      let success = false;
      
      // Handle special cases like technical sheets and guides
      if (moduleName === 'fiche_technique') {
        return await exportToPDF(data, `${companyName}_technical_sheet`, {
          title: `${companyName} - Technical Sheet`,
          landscape: false,
          template: 'technical_sheet'
        });
      } else if (moduleName === 'guide_cultures') {
        return true;
      }
      
      // Standard formats
      switch (format) {
        case 'csv':
          success = exportToCSV(data, `${companyName}_${moduleName}`);
          break;
        case 'excel':
          success = exportToExcel(data, `${companyName}_${moduleName}`);
          break;
        case 'pdf':
          success = await exportToPDF(data, `${companyName}_${moduleName}`);
          break;
        default:
          return false;
      }
      
      return success;
    } catch (error) {
      console.error(`Error exporting ${moduleName} data:`, error);
      return false;
    }
  }, [getModuleData, companyName]);

  // Import module data
  const importModuleData = useCallback(async (moduleName: string, file: File): Promise<boolean> => {
    try {
      const importedData = await importFromCSV(file);
      
      if (importedData && importedData.length > 0) {
        updateModuleData(moduleName, {
          items: importedData
        });
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error(`Error importing ${moduleName} data:`, error);
      return false;
    }
  }, [updateModuleData]);

  // Print module data
  const printModuleData = useCallback(async (moduleName: string, options?: any): Promise<boolean> => {
    const data = getModuleData(moduleName);
    
    if (!data || !data.items || !Array.isArray(data.items) || data.items.length === 0) {
      return false;
    }
    
    const moduleNames: Record<string, string> = {
      parcelles: "Parcels",
      cultures: "Crops",
      finances: "Finances",
      statistiques: "Statistics",
      inventaire: "Inventory",
      fiche_technique: "Technical Sheet"
    };
    
    const title = `${companyName} - ${moduleNames[moduleName] || moduleName}`;
    
    try {
      return await printData(
        data.items,
        title,
        data.columns || Object.keys(data.items[0]).map(key => ({ key, header: key })),
        options
      );
    } catch (error) {
      console.error(`Error printing ${moduleName} data:`, error);
      return false;
    }
  }, [getModuleData, companyName]);

  // Synchronisation initiale au chargement
  useEffect(() => {
    const initialSync = setTimeout(() => {
      syncDataAcrossCRM();
    }, 1000);
    
    return () => clearTimeout(initialSync);
  }, [syncDataAcrossCRM]);

  return {
    lastSync,
    isRefreshing,
    companyName,
    activeModules,
    syncDataAcrossCRM,
    updateModuleData,
    getModuleData,
    exportModuleData,
    importModuleData,
    printModuleData
  };
};

export default useCRMContext;
