
import React, { useState } from 'react';
import PageLayout from '../components/layout/PageLayout';
import Dashboard from '../components/Dashboard';
import TabContainer, { TabItem } from '../components/layout/TabContainer';
import HarvestTracking from '../components/HarvestTracking';
import WeatherAlerts from '../components/WeatherAlerts';
import TaskList from '../components/cultures/TaskList';
import { AIAssistant } from '../components/ai/AIAssistant';
import { Button } from '@/components/ui/button';
import { PlusCircle, Download, Filter, RefreshCw, Upload, Printer } from 'lucide-react';
import { StatisticsProvider } from '../contexts/StatisticsContext';
import { useCRM } from '../contexts/CRMContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

const Index = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [userName, setUserName] = useState('Farmer');
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  
  // Utiliser le contexte CRM
  const { 
    lastSync,
    isRefreshing,
    syncDataAcrossCRM,
    exportModuleData,
    importModuleData,
    printModuleData
  } = useCRM();

  // Actions based on the active tab
  const getTabActions = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="flex flex-wrap gap-3">
            <Button 
              variant="outline" 
              className="flex items-center gap-2 bg-card border border-border hover:bg-muted transition-colors"
              onClick={syncDataAcrossCRM}
            >
              <RefreshCw className={`h-4 w-4 text-muted-foreground ${isRefreshing ? 'animate-spin' : ''}`} />
              Sync
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-card border border-border hover:bg-muted transition-colors"
              onClick={() => handleExportData('dashboard')}
            >
              <Download className="h-4 w-4 text-muted-foreground" />
              Export
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-card border border-border hover:bg-muted transition-colors"
              onClick={() => handleImportData()}
            >
              <Upload className="h-4 w-4 text-muted-foreground" />
              Import
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-card border border-border hover:bg-muted transition-colors"
              onClick={() => handlePrintData('dashboard')}
            >
              <Printer className="h-4 w-4 text-muted-foreground" />
              Print
            </Button>
          </div>
        );
      case 'harvest':
        return (
          <div className="flex flex-wrap gap-3">
            <Button 
              variant="outline" 
              className="flex items-center gap-2 bg-card border border-border hover:bg-muted"
              onClick={() => handleExportData('harvest')}
            >
              <Download className="h-4 w-4 text-muted-foreground" />
              Export
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-card border border-border hover:bg-muted"
              onClick={() => handlePrintData('harvest')}
            >
              <Printer className="h-4 w-4 text-muted-foreground" />
              Print
            </Button>
          </div>
        );
      case 'weather':
        return (
          <div className="flex flex-wrap gap-3">
            <Button 
              variant="outline" 
              className="flex items-center gap-2 bg-card border border-border hover:bg-muted"
              onClick={() => handleExportData('weather')}
            >
              <Download className="h-4 w-4 text-muted-foreground" />
              Export
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-2 bg-card border border-border hover:bg-muted"
            >
              <Filter className="h-4 w-4 text-muted-foreground" />
              Configure
            </Button>
          </div>
        );
      case 'tasks':
        return (
          <div className="flex flex-wrap gap-3">
            <Button 
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
            >
              <PlusCircle className="h-4 w-4" />
              Add
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-card border border-border hover:bg-muted"
              onClick={() => handleExportData('tasks')}
            >
              <Download className="h-4 w-4 text-muted-foreground" />
              Export
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-card border border-border hover:bg-muted"
              onClick={() => handlePrintData('tasks')}
            >
              <Printer className="h-4 w-4 text-muted-foreground" />
              Print
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    console.log(`Tab changed to: ${value}`);
  };

  // Data operations
  const handleExportData = async (tab: string) => {
    const moduleMapping: {[key: string]: string} = {
      'dashboard': 'statistiques',
      'harvest': 'cultures',
      'weather': 'statistiques',
      'tasks': 'cultures'
    };
    
    const module = moduleMapping[tab] || 'statistiques';
    const format = tab === 'dashboard' ? 'excel' : 'csv';
    
    try {
      await exportModuleData(module, format as 'csv' | 'excel' | 'pdf');
      console.log(`Export of ${module} data in ${format} format started`);
    } catch (error) {
      console.error(`Error exporting ${module}:`, error);
    }
  };

  const handleImportData = () => {
    setImportDialogOpen(true);
  };

  const handleImportConfirm = async () => {
    if (!selectedFile) {
      console.error("No file selected");
      return;
    }
    
    const moduleMapping = {
      'dashboard': 'statistiques',
      'harvest': 'cultures',
      'weather': 'statistiques',
      'tasks': 'cultures'
    };
    
    const module = moduleMapping[activeTab] || 'statistiques';
    
    try {
      await importModuleData(module, selectedFile);
      console.log(`Import of file ${selectedFile.name} successful`);
    } catch (error) {
      console.error(`Error importing ${module}:`, error);
    }
    
    setImportDialogOpen(false);
    setSelectedFile(null);
  };

  const handlePrintData = async (tab: string) => {
    const moduleMapping = {
      'dashboard': 'statistiques',
      'harvest': 'cultures',
      'weather': 'statistiques',
      'tasks': 'cultures'
    };
    
    const module = moduleMapping[tab] || 'statistiques';
    
    try {
      await printModuleData(module);
      console.log(`Print of ${module} data started`);
    } catch (error) {
      console.error(`Error printing ${module}:`, error);
    }
  };

  const tabs: TabItem[] = [
    {
      value: 'dashboard',
      label: 'Dashboard',
      content: <Dashboard />
    },
    {
      value: 'harvest',
      label: 'Harvest Tracking',
      content: <HarvestTracking />
    },
    {
      value: 'weather',
      label: 'Weather Alerts',
      content: <WeatherAlerts />
    },
    {
      value: 'tasks',
      label: 'Tasks',
      content: <TaskList />
    }
  ];

  return (
    <StatisticsProvider>
      <PageLayout>
        <div className="p-6 animate-enter">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Agri Dom Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome, {userName} | Last sync: {lastSync.toLocaleTimeString()}
              </p>
            </div>
            {getTabActions()}
          </div>
          
          <TabContainer 
            tabs={tabs}
            defaultValue={activeTab}
            onValueChange={handleTabChange}
          />
          
          <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Import Data</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="file">CSV File</Label>
                  <input 
                    type="file" 
                    id="file" 
                    accept=".csv" 
                    onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                    className="w-full border border-input bg-background px-3 py-2 text-sm rounded-md"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Data will be imported into the current module. 
                  Make sure the file is in CSV format.
                </p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setImportDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleImportConfirm}>Import</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* AI Assistant */}
          <AIAssistant 
            isOpen={aiAssistantOpen} 
            onToggle={() => setAiAssistantOpen(!aiAssistantOpen)} 
          />
        </div>
      </PageLayout>
    </StatisticsProvider>
  );
};

export default Index;
