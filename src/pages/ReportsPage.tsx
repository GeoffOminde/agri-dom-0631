import React, { useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import PageHeader from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, BarChart, Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';

// Mock report generation function - replace with actual API calls
const generateReport = async (type: string, format: 'pdf' | 'excel' | 'csv') => {
  // Simulate API call delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 1500);
  });
};

const ReportsPage: React.FC = () => {
  const [loading, setLoading] = useState<{[key: string]: boolean}>({});
  const [activeTab, setActiveTab] = useState('financial');

  const handleGenerateReport = async (reportType: string, format: 'pdf' | 'excel' | 'csv') => {
    try {
      setLoading(prev => ({ ...prev, [`${reportType}-${format}`]: true }));
      
      await generateReport(reportType, format);
      
      // Simulate file download
      const blob = new Blob([`${reportType} report generated at ${new Date().toISOString()}`], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${reportType}-report-${formatDate(new Date())}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Report generated', {
        description: `Your ${reportType} report has been generated and downloaded.`
      });
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Error', {
        description: 'Failed to generate report. Please try again.'
      });
    } finally {
      setLoading(prev => ({ ...prev, [`${reportType}-${format}`]: false }));
    }
  };

  const formatDate = (date: Date) => {
    return format(date, 'yyyy-MM-dd');
  };

  const ReportButton: React.FC<{
    reportType: string;
    format: 'pdf' | 'excel' | 'csv';
    icon: React.ReactNode;
    label: string;
  }> = ({ reportType, format, icon, label }) => {
    const isLoading = loading[`${reportType}-${format}`];
    
    return (
      <Button 
        variant="outline" 
        className="w-full justify-start group hover:bg-accent/50 transition-colors"
        onClick={() => handleGenerateReport(reportType, format)}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <span className="group-hover:scale-110 transition-transform">
            {icon}
          </span>
        )}
        <span className="ml-2">{label}</span>
      </Button>
    );
  };

  return (
    <PageLayout>
      <PageHeader
        title="Reports"
        description="Generate and download summary reports for your data"
      />

      <Tabs 
        defaultValue="financial" 
        className="w-full"
        onValueChange={setActiveTab}
        value={activeTab}
      >
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-6">
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="production">Production</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <div className="space-y-6">
          {/* Financial Reports */}
          <TabsContent value="financial" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-500" /> 
                    Financial Reports
                  </CardTitle>
                  <CardDescription>
                    Generate detailed financial reports
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ReportButton
                    reportType="profitability"
                    format="pdf"
                    icon={<FileText className="h-4 w-4 mr-2" />}
                    label="Profitability Report"
                  />
                  <ReportButton
                    reportType="cashflow"
                    format="excel"
                    icon={<FileText className="h-4 w-4 mr-2" />}
                    label="Cash Flow Statement"
                  />
                  <ReportButton
                    reportType="balance-sheet"
                    format="pdf"
                    icon={<FileText className="h-4 w-4 mr-2" />}
                    label="Balance Sheet"
                  />
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart className="h-5 w-5 text-green-500" /> 
                    Expense Analysis
                  </CardTitle>
                  <CardDescription>
                    Detailed expense breakdowns
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ReportButton
                    reportType="expense-categories"
                    format="excel"
                    icon={<FileText className="h-4 w-4 mr-2" />}
                    label="Expense by Category"
                  />
                  <ReportButton
                    reportType="monthly-expenses"
                    format="pdf"
                    icon={<FileText className="h-4 w-4 mr-2" />}
                    label="Monthly Expenses"
                  />
                </CardContent>
              </Card>

              <Card className="md:col-span-2 lg:col-span-1 hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="h-5 w-5 text-purple-500" /> 
                    Quick Export
                  </CardTitle>
                  <CardDescription>
                    Export your financial data
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ReportButton
                    reportType="transactions"
                    format="csv"
                    icon={<FileText className="h-4 w-4 mr-2" />}
                    label="Export Transactions (CSV)"
                  />
                  <ReportButton
                    reportType="financial-summary"
                    format="excel"
                    icon={<FileText className="h-4 w-4 mr-2" />}
                    label="Financial Summary (Excel)"
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Production Reports */}
          <TabsContent value="production" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-amber-500" /> 
                    Production Reports
                  </CardTitle>
                  <CardDescription>
                    Generate production reports
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ReportButton
                    reportType="yield"
                    format="pdf"
                    icon={<FileText className="h-4 w-4 mr-2" />}
                    label="Yield Report"
                  />
                  <ReportButton
                    reportType="harvest"
                    format="excel"
                    icon={<FileText className="h-4 w-4 mr-2" />}
                    label="Harvest Logs"
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Inventory Reports */}
          <TabsContent value="inventory" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-emerald-500" /> 
                    Inventory Reports
                  </CardTitle>
                  <CardDescription>
                    Generate inventory reports
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ReportButton
                    reportType="inventory-levels"
                    format="pdf"
                    icon={<FileText className="h-4 w-4 mr-2" />}
                    label="Current Inventory"
                  />
                  <ReportButton
                    reportType="inventory-movements"
                    format="excel"
                    icon={<FileText className="h-4 w-4 mr-2" />}
                    label="Inventory Movements"
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Reports */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart className="h-5 w-5 text-indigo-500" /> 
                    Analytics Reports
                  </CardTitle>
                  <CardDescription>
                    Generate analytical reports
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ReportButton
                    reportType="performance"
                    format="pdf"
                    icon={<FileText className="h-4 w-4 mr-2" />}
                    label="Performance Analytics"
                  />
                  <ReportButton
                    reportType="trends"
                    format="excel"
                    icon={<FileText className="h-4 w-4 mr-2" />}
                    label="Trend Analysis"
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </PageLayout>
  );
};

export default ReportsPage;
