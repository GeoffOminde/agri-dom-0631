import React from 'react';
import PageLayout from '@/components/layout/PageLayout';
import PageHeader from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, BarChart } from 'lucide-react';

const ReportsPage: React.FC = () => {
  return (
    <PageLayout>
      <PageHeader
        title="Reports"
        description="Generate and download summary reports for your data"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-muted-foreground" /> PDF Reports
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <FileText className="h-4 w-4 mr-2" /> Profitability report
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <FileText className="h-4 w-4 mr-2" /> Expense analysis
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5 text-muted-foreground" /> Quick Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Use the Statistics page for interactive charts and comparisons. This
              Reports page provides quick access to downloadable documents.
            </p>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default ReportsPage;
