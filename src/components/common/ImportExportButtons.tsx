
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Upload, Printer, FileText } from 'lucide-react';
import { useCRM } from '../../contexts/CRMContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import ReportGenerationButton from './ReportGenerationButton';

interface ImportExportButtonsProps {
  moduleName: string;
  className?: string;
  onImportComplete?: () => void;
  showPrint?: boolean;
  showTechnicalSheet?: boolean;
  showReportGeneration?: boolean;
}

const ImportExportButtons: React.FC<ImportExportButtonsProps> = ({
  moduleName,
  className = "",
  onImportComplete,
  showPrint = true,
  showTechnicalSheet = false,
  showReportGeneration = true
}) => {
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [exportFormat, setExportFormat] = useState<'csv' | 'excel' | 'pdf'>('csv');
  
  const { exportModuleData, importModuleData, printModuleData } = useCRM();
  
  const handleExportClick = () => {
    setExportDialogOpen(true);
  };
  
  const handleExportConfirm = async () => {
    try {
      await exportModuleData(moduleName, exportFormat);
    } catch (error) {
      console.error(`Error exporting ${moduleName}:`, error);
    }
    
    setExportDialogOpen(false);
  };
  
  const handleImportClick = () => {
    setImportDialogOpen(true);
  };
  
  const handleImportConfirm = async () => {
    if (!selectedFile) {
      console.error("No file selected");
      return;
    }
    
    try {
      const success = await importModuleData(moduleName, selectedFile);
      
      if (success && onImportComplete) {
        onImportComplete();
      }
    } catch (error) {
      console.error(`Error importing ${moduleName}:`, error);
    }
    
    setImportDialogOpen(false);
    setSelectedFile(null);
  };
  
  const handlePrintClick = async () => {
    try {
      await printModuleData(moduleName);
    } catch (error) {
      console.error(`Error printing ${moduleName}:`, error);
    }
  };
  
  const handleTechnicalSheetClick = async () => {
    try {
      await exportModuleData('guide_cultures', 'pdf');
    } catch (error) {
      console.error("Error generating technical guide:", error);
    }
  };
  
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {showReportGeneration && (
        <ReportGenerationButton
          moduleName={moduleName}
          className="mr-2"
        />
      )}
      
      <Button
        variant="outline"
        className="flex items-center gap-2"
        onClick={handleExportClick}
      >
        <Download className="h-4 w-4 mr-2" />
        Export
      </Button>
      
      <Button
        variant="outline"
        className="flex items-center gap-2"
        onClick={handleImportClick}
      >
        <Upload className="h-4 w-4 mr-2" />
        Import
      </Button>
      
      {showPrint && (
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={handlePrintClick}
        >
          <Printer className="h-4 w-4 mr-2" />
          Print
        </Button>
      )}
      
      {showTechnicalSheet && (
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={handleTechnicalSheetClick}
        >
          <FileText className="h-4 w-4 mr-2" />
          Technical guide
        </Button>
      )}
      
      {/* Import Dialog */}
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import data</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="file">CSV file</Label>
              <input 
                type="file" 
                id="file" 
                accept=".csv" 
                onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                className="w-full border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Data will be imported into the {moduleName} module.
              Make sure the file is in CSV format.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setImportDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleImportConfirm}>Import</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Export Dialog */}
      <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export data</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Export format</Label>
              <div className="flex gap-2">
                <Button 
                  variant={exportFormat === 'csv' ? 'default' : 'outline'}
                  onClick={() => setExportFormat('csv')}
                  className="flex-1"
                >
                  CSV
                </Button>
                <Button 
                  variant={exportFormat === 'excel' ? 'default' : 'outline'}
                  onClick={() => setExportFormat('excel')}
                  className="flex-1"
                >
                  Excel
                </Button>
                <Button 
                  variant={exportFormat === 'pdf' ? 'default' : 'outline'}
                  onClick={() => setExportFormat('pdf')}
                  className="flex-1"
                >
                  PDF
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setExportDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleExportConfirm}>Export</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImportExportButtons;
