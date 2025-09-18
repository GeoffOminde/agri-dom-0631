
import React, { useState } from 'react';
import { Download, Printer, Share2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useCRM } from '../../contexts/CRMContext';
import ReportGenerationButton from '../common/ReportGenerationButton';
import { useIsMobile } from '@/hooks/use-mobile';
import PreviewPrintButton from '../common/PreviewPrintButton';
import { useStatistics } from '@/contexts/StatisticsContext';

const StatisticsHeader = () => {
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const { exportModuleData, printModuleData, getModuleData } = useCRM();
  const { yieldData, financialData, environmentalData } = useStatistics();
  const isMobile = useIsMobile();
  
  // Combine all statistics data for preview/print
  const statisticsData = [
    ...(yieldData || []).map(item => ({ ...item, type: 'yield' })),
    ...(financialData.profitabilityByParcel || []).map(item => ({ ...item, type: 'financial' })),
    ...(environmentalData.indicators || []).map(item => ({ ...item, type: 'environment' }))
  ];

  const handleExport = async () => {
    try {
      console.log("Exporting statistics to CSV format...");
      await exportModuleData('statistics', 'csv');
      console.log("Export successful!");
    } catch (error) {
      console.error("Error exporting statistics:", error);
    }
  };

  const handlePrint = async () => {
    try {
      console.log("Preparing statistics for printing...");
      await printModuleData('statistics');
      console.log("Document sent to printer");
    } catch (error) {
      console.error("Error printing statistics:", error);
    }
  };

  const handleShare = () => {
    setShareDialogOpen(true);
    console.log("Opening share dialog");
  };
  
  const handleShareByEmail = () => {
    console.log("Preparing email share...");
    setShareDialogOpen(false);
    console.log("Share email prepared");
  };
  
  const handleShareByPDF = async () => {
    try {
      console.log("Generating PDF for share...");
      await exportModuleData('statistics', 'pdf');
      setShareDialogOpen(false);
      console.log("PDF generated successfully for sharing");
    } catch (error) {
      console.error("Error generating PDF:", error);
      setShareDialogOpen(false);
    }
  };

  return (
    <header className="flex flex-col mb-6 gap-4">
      <div>
        <h1 className="text-xl md:text-2xl font-bold mb-1 text-gray-800">Statistics and Analytics</h1>
        <p className="text-sm md:text-base text-gray-500">Visualize and analyze your farm data</p>
      </div>
      <div className="flex flex-wrap gap-2 md:gap-3 justify-start md:justify-end">
        <ReportGenerationButton 
          moduleName="statistics" 
          className="bg-green-600 hover:bg-green-700 text-white text-xs md:text-sm px-2 md:px-4 py-1.5 md:py-2"
          withAnimation={false}
        />
        
        {!isMobile ? (
          <>
            <PreviewPrintButton 
              data={statisticsData}
              moduleName="statistics"
              title="Statistics and Analytics"
              className="bg-white border-gray-200 hover:bg-gray-50 text-xs md:text-sm h-auto py-1.5 md:py-2"
              variant="outline"
              columns={[
                { key: "type", header: "Type" },
                { key: "name", header: "Name" },
                { key: "current", header: "Current value" },
                { key: "previous", header: "Previous value" },
                { key: "unit", header: "Unit" }
              ]}
            />
            
            <Button 
              variant="outline" 
              onClick={handleExport}
              className="bg-white border-gray-200 hover:bg-gray-50 text-xs md:text-sm h-auto py-1.5 md:py-2"
              size={isMobile ? "sm" : "default"}
            >
              <Download className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1.5 md:mr-2 text-gray-600" />
              {isMobile ? "CSV" : "Export CSV"}
            </Button>
          </>
        ) : null}
        <Button 
          variant="outline" 
          onClick={handleShare}
          className="bg-white border-gray-200 hover:bg-gray-50 text-xs md:text-sm h-auto py-1.5 md:py-2"
          size={isMobile ? "sm" : "default"}
        >
          <Share2 className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1.5 md:mr-2 text-gray-600" />
          {isMobile ? "Share" : "Share"}
        </Button>
      </div>
      
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="sm:max-w-md max-w-[90%]">
          <DialogHeader>
            <DialogTitle>Share Statistics</DialogTitle>
            <DialogDescription>
              Choose how you want to share these statistics
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <Button onClick={handleShareByEmail} variant="outline">
                Send by Email
              </Button>
              <Button onClick={handleShareByPDF} className="bg-green-600 hover:bg-green-700">
                Generate PDF
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShareDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default StatisticsHeader;
