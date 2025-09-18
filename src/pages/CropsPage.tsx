
import React, { useState } from 'react';
import PageLayout from '../components/layout/PageLayout';
import HarvestTracking from '../components/HarvestTracking';
import SpecificCrops from '../components/SpecificCrops';
import CropPlanning from '../components/CropPlanning';
import TabContainer, { TabItem } from '../components/layout/TabContainer';
import { Button } from '@/components/ui/button';
import { Download, Plus, Upload, Filter, RefreshCw, CalendarRange, Eye, Printer } from 'lucide-react';
import { StatisticsProvider } from '../contexts/StatisticsContext';
import { CRMProvider } from '../contexts/CRMContext';
import { motion } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PreviewPrintButton from '@/components/common/PreviewPrintButton';
import { useCRM } from '@/contexts/CRMContext';

const CropsPage = () => {
  const [activeTab, setActiveTab] = useState<string>('harvest');
  const { getModuleData } = useCRM();
  
  // Get harvest data for preview/print
  const harvestData = getModuleData('cultures').items || [];
  
  // Print columns for different tabs
  const printColumns = {
    harvest: [
      { key: "nom", header: "Crop" },
      { key: "rendement", header: "Yield (t/ha)" },
      { key: "surface", header: "Area (ha)" },
      { key: "date", header: "Harvest date" }
    ],
    specific: [
      { key: "nom", header: "Name" },
      { key: "variete", header: "Variety" },
      { key: "dateDebut", header: "Start date" },
      { key: "dateFin", header: "End date" }
    ],
    planning: [
      { key: "nom", header: "Crop" },
      { key: "activite", header: "Activity" },
      { key: "dateDebut", header: "Start date" },
      { key: "dateFin", header: "End date" },
      { key: "statut", header: "Status" }
    ]
  };

  // Actions based on the active tab
  const getTabActions = () => {
    switch (activeTab) {
      case 'harvest':
        return (
          <div className="flex flex-wrap gap-2">
            <PreviewPrintButton 
              data={harvestData}
              moduleName="harvest"
              title="Harvest Tracking"
              columns={printColumns.harvest}
              variant="outline"
            />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 transition-colors">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white border shadow-lg">
                <DropdownMenuItem 
                  onClick={() => console.log("Export CSV of harvest data")}
                  className="cursor-pointer"
                >
                  Export CSV
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => console.log("Export Excel of harvest data")}
                  className="cursor-pointer"
                >
                  Export Excel
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => console.log("Export PDF of harvest data")}
                  className="cursor-pointer"
                >
                  Export PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button 
              variant="outline" 
              className="flex items-center gap-2 transition-colors"
              onClick={() => {
                console.log("Harvest data synchronization");
              }}
            >
              <RefreshCw className="h-4 w-4" />
              Sync
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-2 transition-colors"
              onClick={() => {
                console.log("Filters applied to harvest data");
              }}
            >
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
        );
      case 'specific':
        return (
          <div className="flex flex-wrap gap-2">
            <PreviewPrintButton 
              data={getModuleData('cultures').items || []}
              moduleName="cultures"
              title="Specific Crops"
              columns={printColumns.specific}
              variant="outline"
            />
            
            <Button 
              className="flex items-center gap-2 bg-agri-primary hover:bg-agri-primary-dark transition-colors"
              onClick={() => {
                console.log("Add new crop");
              }}
            >
              <Plus className="h-4 w-4" />
              Add
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-2 transition-colors"
              onClick={() => {
                console.log("Export crop data");
              }}
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        );
      case 'planning':
        return (
          <div className="flex flex-wrap gap-2">
            <PreviewPrintButton 
              data={[]}
              moduleName="planning"
              title="Crop Planning"
              columns={printColumns.planning}
              variant="outline"
            />
            
            <Button 
              variant="outline" 
              className="flex items-center gap-2 transition-colors"
              onClick={() => {
                console.log("Planning crop calendar");
              }}
            >
              <CalendarRange className="h-4 w-4" />
              Plan
            </Button>
            <Button 
              className="flex items-center gap-2 transition-colors"
              onClick={() => {
                console.log("Add new crop task");
              }}
            >
              <Plus className="h-4 w-4" />
              New task
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    const tabLabels = {
      harvest: 'Harvest Tracking',
      specific: 'Specific Crops',
      planning: 'Planning'
    };
    
    const label = tabLabels[value as keyof typeof tabLabels] || value;
    console.log(`${label} enabled - Displaying corresponding data`);
  };

  const tabs: TabItem[] = [
    {
      value: 'harvest',
      label: 'Harvest Tracking',
      content: <HarvestTracking />
    },
    {
      value: 'specific',
      label: 'Specific Crops',
      content: <SpecificCrops />
    },
    {
      value: 'planning',
      label: 'Planning',
      content: <CropPlanning />
    }
  ];

  return (
    <CRMProvider>
      <StatisticsProvider>
        <PageLayout>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="p-6 animate-enter"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h1 className="text-3xl font-bold">Crop Management</h1>
                <p className="text-muted-foreground">
                  Manage your tropical crops and track their yield
                </p>
              </div>
              {getTabActions()}
            </div>
            
            <TabContainer 
              tabs={tabs}
              defaultValue={activeTab}
              onValueChange={handleTabChange}
            />
          </motion.div>
        </PageLayout>
      </StatisticsProvider>
    </CRMProvider>
  );
};

export default CropsPage;
