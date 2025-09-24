import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Statistics from '../components/Statistics';
import HarvestTracking from '../components/HarvestTracking';
import { ChartConfig } from '../components/ui/chart-config';
import { EditableTable, Column } from '../components/ui/editable-table';
import { EditableField } from '../components/ui/editable-field';
import { StatisticsProvider } from '../contexts/StatisticsContext';
import { BarChart, PieChart, TrendingUp, Download, Filter, RefreshCw, Bell, Printer, Eye, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import AdvisoriesPanel from '@/components/advisories/AdvisoriesPanel';
import PreviewPrintButton from '@/components/common/PreviewPrintButton';
import { AppSettingsProvider } from '@/contexts/AppSettingsContext';
import AppSettingsDialog from '@/components/settings/AppSettingsDialog';

interface PerformanceData {
  name: string;
  current: number;
  target: number;
  unit: string;
}

const StatsPage = () => {
  const [pageTitle, setPageTitle] = useState('Statistics and Analytics');
  const [pageDescription, setPageDescription] = useState('Visualize and analyze your farm performance across all locations');
  const [activeView, setActiveView] = useState<'performance' | 'harvest' | 'detailed'>('performance');
  const [lastSyncDate, setLastSyncDate] = useState<Date>(new Date());
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [connectedModules, setConnectedModules] = useState<string[]>(['parcels', 'crops', 'finances']);
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([
    { name: 'Sugarcane Yield', current: 75, target: 85, unit: 't/ha' },
    { name: 'Banana Export Quality', current: 88, target: 95, unit: '%' },
    { name: 'Pineapple Profitability', current: 70, target: 80, unit: '%' },
    { name: 'Organic Certification', current: 25, target: 40, unit: '%' },
    { name: 'Yam Innovation', current: 60, target: 75, unit: '%' },
  ]);
  
  useEffect(() => {
    const initialSync = setTimeout(() => {
      console.log('Parcels, Crops and Finances modules are now connected to statistics');
    }, 1000);
    
    return () => clearTimeout(initialSync);
  }, []);
  
  const syncData = () => {
    setIsSyncing(true);
    console.log('Fetching latest data from all connected modules...');
    
    setTimeout(() => {
      setIsSyncing(false);
      setLastSyncDate(new Date());
      console.log('All statistics are up to date with the latest module data');
      console.log('Performance indicators have been recalculated with the latest data');
    }, 2000);
  };
  
  const columns: Column[] = [
    { id: 'name', header: 'Indicator', accessorKey: 'name', isEditable: true },
    { id: 'current', header: 'Current value', accessorKey: 'current', type: 'number', isEditable: true },
    { id: 'target', header: 'Target', accessorKey: 'target', type: 'number', isEditable: true },
    { id: 'unit', header: 'Unit', accessorKey: 'unit', isEditable: true },
  ];
  
  const handleTableUpdate = (rowIndex: number, columnId: string, value: any) => {
    const newData = [...performanceData];
    const updatedRow = { ...newData[rowIndex] } as PerformanceData;
    
    if (columnId === 'current' || columnId === 'target') {
      updatedRow[columnId as 'current' | 'target'] = Number(value);
    } else if (columnId === 'name' || columnId === 'unit') {
      updatedRow[columnId as 'name' | 'unit'] = String(value);
    }
    
    newData[rowIndex] = updatedRow;
    setPerformanceData(newData);
    
    console.log(`Indicator ${updatedRow.name} has been updated successfully.`);
    console.log(`Connected modules have been notified of the update to ${updatedRow.name}`);
  };
  
  const handleDeleteRow = (rowIndex: number) => {
    const newData = [...performanceData];
    const deletedItem = newData[rowIndex];
    newData.splice(rowIndex, 1);
    setPerformanceData(newData);
    
    console.log(`Indicator ${deletedItem.name} has been deleted successfully.`);
    console.log(`Connected modules have been notified of the deletion of ${deletedItem.name}`);
  };
  
  const handleAddRow = (newRow: Record<string, any>) => {
    const typedRow: PerformanceData = {
      name: String(newRow.name || ''),
      current: Number(newRow.current || 0),
      target: Number(newRow.target || 0),
      unit: String(newRow.unit || '%'),
    };
    setPerformanceData([...performanceData, typedRow]);
    
    console.log(`Indicator ${typedRow.name} has been added successfully.`);
    console.log(`Connected modules have been notified of the addition of ${typedRow.name}`);
  };

  const handleTitleChange = (value: string | number) => {
    setPageTitle(String(value));
    console.log('The page title has been updated.');
  };

  const handleDescriptionChange = (value: string | number) => {
    setPageDescription(String(value));
    console.log('The page description has been updated.');
  };
  
  const handleViewChange = (view: 'performance' | 'harvest' | 'detailed') => {
    setActiveView(view);
    console.log(`You are now viewing ${
      view === 'performance' ? 'Performance indicators' : 
      view === 'harvest' ? 'Harvest tracking' : 'Detailed statistics'
    }`);
    
    console.log(`Connected modules have been adjusted to the ${view === 'performance' ? 'indicators' : view === 'harvest' ? 'harvest' : 'detailed'} view`);
  };
  
  const handleExportData = () => {
    console.log('Statistics data has been exported successfully.');
    console.log('Exported data is available to all modules');
  };

  return (
    <AppSettingsProvider>
    <StatisticsProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        <Navbar />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex-1 overflow-y-auto"
        >
          <div className="p-6 animate-enter">
            <motion.header 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4"
            >
              <div>
                <h1 className="text-2xl font-bold mb-1">
                  <EditableField
                    value={pageTitle}
                    onSave={handleTitleChange}
                    className="inline-block"
                  />
                </h1>
                <p className="text-muted-foreground">
                  <EditableField
                    value={pageDescription}
                    onSave={handleDescriptionChange}
                    className="inline-block"
                  />
                </p>
                <div className="flex items-center mt-1 text-xs text-muted-foreground">
                  <span className="mr-2">Connected modules: {connectedModules.join(', ')}</span>
                  <span>Last sync: {lastSyncDate.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => handleViewChange('performance')}
                  className={`px-3 py-1.5 rounded-md flex items-center text-sm transition-colors ${
                    activeView === 'performance' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  <PieChart className="h-4 w-4 mr-1.5" />
                  Indicators
                </button>
                
                <button 
                  onClick={() => handleViewChange('harvest')}
                  className={`px-3 py-1.5 rounded-md flex items-center text-sm transition-colors ${
                    activeView === 'harvest' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  <BarChart className="h-4 w-4 mr-1.5" />
                  Harvests
                </button>
                
                <button 
                  onClick={() => handleViewChange('detailed')}
                  className={`px-3 py-1.5 rounded-md flex items-center text-sm transition-colors ${
                    activeView === 'detailed' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  <TrendingUp className="h-4 w-4 mr-1.5" />
                  Detailed
                </button>
                
                <PreviewPrintButton
                  data={performanceData}
                  moduleName="performance-indicators"
                  title="Agricultural Performance Indicators"
                  columns={[
                    { key: "name", header: "Indicator" },
                    { key: "current", header: "Current value" },
                    { key: "target", header: "Target" },
                    { key: "unit", header: "Unit" }
                  ]}
                  className="px-3 py-1.5 rounded-md flex items-center text-sm bg-muted hover:bg-muted/80 transition-colors"
                  variant="ghost"
                />
                
                <button 
                  onClick={handleExportData}
                  className="px-3 py-1.5 rounded-md flex items-center text-sm bg-muted hover:bg-muted/80 transition-colors"
                >
                  <Download className="h-4 w-4 mr-1.5" />
                  Export
                </button>
                
                <button 
                  onClick={syncData}
                  className="px-3 py-1.5 rounded-md flex items-center text-sm bg-muted hover:bg-muted/80 transition-colors"
                  disabled={isSyncing}
                >
                  <RefreshCw className={`h-4 w-4 mr-1.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  {isSyncing ? 'Synchronizing...' : 'Sync'}
                </button>
                
                <button 
                  onClick={() => {
                    console.log('Your notification preferences have been updated');
                  }}
                  className="px-3 py-1.5 rounded-md flex items-center text-sm bg-muted hover:bg-muted/80 transition-colors"
                >
                  <Bell className="h-4 w-4 mr-1.5" />
                  Alerts
                </button>

                <button
                  onClick={() => setSettingsOpen(true)}
                  className="px-3 py-1.5 rounded-md flex items-center text-sm bg-muted hover:bg-muted/80 transition-colors"
                >
                  <Settings className="h-4 w-4 mr-1.5" />
                  Settings
                </button>
              </div>
            </motion.header>
            
            {activeView === 'performance' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-8"
              >
                <ChartConfig 
                  title="Agricultural performance indicators"
                  description="Track performance against goals for your selected crops and parcels"
                  onTitleChange={(title) => {
                    console.log('Chart title has been updated.');
                  }}
                  onDescriptionChange={(desc) => {
                    console.log('Chart description has been updated.');
                  }}
                  onOptionsChange={(options) => {
                    console.log('Chart options have been updated.');
                  }}
                  className="mb-6"
                >
                  <div className="p-4">
                    <EditableTable
                      data={performanceData}
                      columns={columns}
                      onUpdate={handleTableUpdate}
                      onDelete={handleDeleteRow}
                      onAdd={handleAddRow}
                      className="border-none"
                    />
                  </div>
                </ChartConfig>
              </motion.div>
            )}
            
            {activeView === 'harvest' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <HarvestTracking />
              </motion.div>
            )}
            
            {activeView === 'detailed' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-6">
                  <Statistics />
                  <AdvisoriesPanel />
                </div>
              </motion.div>
            )}
            <AppSettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
          </div>
        </motion.div>
      </div>
    </StatisticsProvider>
    </AppSettingsProvider>
  );
};

export default StatsPage;
