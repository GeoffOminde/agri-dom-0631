
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation('common');
  
  // Get harvest data for preview/print
  const harvestData = getModuleData('cultures').items || [];
  
  // Print columns for different tabs
  const printColumns = {
    harvest: [
      { key: "nom", header: t('crop') },
      { key: "rendement", header: t('yield_tha') },
      { key: "surface", header: t('area_ha') },
      { key: "date", header: t('harvest_date') }
    ],
    specific: [
      { key: "nom", header: t('name') },
      { key: "variete", header: t('variety') },
      { key: "dateDebut", header: t('start_date') },
      { key: "dateFin", header: t('end_date') }
    ],
    planning: [
      { key: "nom", header: t('crop') },
      { key: "activite", header: t('activity') },
      { key: "dateDebut", header: t('start_date') },
      { key: "dateFin", header: t('end_date') },
      { key: "statut", header: t('status') }
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
              title={t('harvest_tracking')}
              columns={printColumns.harvest}
              variant="outline"
            />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 transition-colors">
                  <Download className="h-4 w-4" />
                  {t('export')}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-card border shadow-lg">
                <DropdownMenuItem 
                  onClick={() => console.log("Export CSV of harvest data")}
                  className="cursor-pointer"
                >
                  {t('export_csv')}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => console.log("Export Excel of harvest data")}
                  className="cursor-pointer"
                >
                  {t('export_excel')}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => console.log("Export PDF of harvest data")}
                  className="cursor-pointer"
                >
                  {t('export_pdf')}
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
              {t('sync')}
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-2 transition-colors"
              onClick={() => {
                console.log("Filters applied to harvest data");
              }}
            >
              <Filter className="h-4 w-4" />
              {t('filter')}
            </Button>
          </div>
        );
      case 'specific':
        return (
          <div className="flex flex-wrap gap-2">
            <PreviewPrintButton 
              data={getModuleData('cultures').items || []}
              moduleName="cultures"
              title={t('specific_crops')}
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
              {t('add')}
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-2 transition-colors"
              onClick={() => {
                console.log("Export crop data");
              }}
            >
              <Download className="h-4 w-4" />
              {t('export')}
            </Button>
          </div>
        );
      case 'planning':
        return (
          <div className="flex flex-wrap gap-2">
            <PreviewPrintButton 
              data={[]}
              moduleName="planning"
              title={t('crop_planning_title')}
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
              {t('plan')}
            </Button>
            <Button 
              className="flex items-center gap-2 transition-colors"
              onClick={() => {
                console.log("Add new crop task");
              }}
            >
              <Plus className="h-4 w-4" />
              {t('new_task')}
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
      label: t('harvest_tracking'),
      content: <HarvestTracking />
    },
    {
      value: 'specific',
      label: t('specific_crops'),
      content: <SpecificCrops />
    },
    {
      value: 'planning',
      label: t('planning'),
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
                <h1 className="text-3xl font-bold">{t('crop_management_title')}</h1>
                <p className="text-muted-foreground">
                  {t('crop_management_desc')}
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
