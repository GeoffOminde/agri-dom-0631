
import React from 'react';
import { Check, Layers, ArrowRight } from 'lucide-react';
import { useStatistics } from '../../contexts/StatisticsContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const EnvironmentalCharts = () => {
  const { environmentalData } = useStatistics();
  const { indicators, carbonFootprint, waterUsage, biodiversity } = environmentalData;

  const getStatusLabel = (status: string) => {
    // Support both English (current) and French (legacy) inputs
    switch (status) {
      case 'Achieved':
      case 'Atteint':
        return 'Achieved';
      case 'In progress':
      case 'En progrès':
        return 'In progress';
      case 'Behind':
      case 'En retard':
        return 'Behind';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Carbon footprint</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <div className="text-center">
              <div className="inline-block relative">
                <div className="w-32 h-32 rounded-full border-8 border-agri-primary"></div>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-2xl font-bold">{carbonFootprint}%</span>
                  <span className="text-xs text-muted-foreground">vs N-1</span>
                </div>
              </div>
              <p className="mt-4 text-sm">
                Reduction in carbon emissions thanks to sustainable farming practices.
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Water consumption</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <div className="text-center">
              <div className="inline-block relative">
                <div className="w-32 h-32 rounded-full border-8 border-[#2196F3]"></div>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-2xl font-bold">{waterUsage}%</span>
                  <span className="text-xs text-muted-foreground">vs N-1</span>
                </div>
              </div>
              <p className="mt-4 text-sm">
                Reduced water usage by optimizing irrigation.
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Biodiversity</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <div className="text-center">
              <div className="inline-block relative">
                <div className="w-32 h-32 rounded-full border-8 border-[#FFC107]"></div>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-2xl font-bold">+{biodiversity}%</span>
                  <span className="text-xs text-muted-foreground">vs N-1</span>
                </div>
              </div>
              <p className="mt-4 text-sm">
                Increased biodiversity on the farm.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Environmental indicators</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted text-xs uppercase">
                <tr>
                  <th className="px-4 py-2 text-left">Indicator</th>
                  <th className="px-4 py-2 text-left">Current value</th>
                  <th className="px-4 py-2 text-left">Target</th>
                  <th className="px-4 py-2 text-left">Trend</th>
                  <th className="px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {indicators.map((item, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-3 font-medium">{item.indicator}</td>
                    <td className="px-4 py-3">{item.current}</td>
                    <td className="px-4 py-3">{item.target}</td>
                    <td className="px-4 py-3 text-agri-success">{item.trend}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                        getStatusLabel(item.status) === 'Achieved' 
                          ? 'bg-agri-success/10 text-agri-success' 
                          : 'bg-agri-warning/10 text-agri-warning'
                      }`}>
                        {getStatusLabel(item.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Certifications and commitments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-agri-primary/10 flex items-center justify-center mb-2">
                <Check className="h-8 w-8 text-agri-primary" />
              </div>
              <h4 className="font-medium mb-1">Sustainable Agriculture</h4>
              <p className="text-sm text-center text-muted-foreground">
                Certified since 2019
              </p>
            </div>
            <div className="border rounded-lg p-4 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-[#FFC107]/10 flex items-center justify-center mb-2">
                <Layers className="h-8 w-8 text-[#FFC107]" />
              </div>
              <h4 className="font-medium mb-1">HVE Level 2</h4>
              <p className="text-sm text-center text-muted-foreground">
                High Environmental Value
              </p>
            </div>
            <div className="border rounded-lg p-4 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-[#2196F3]/10 flex items-center justify-center mb-2">
                <ArrowRight className="h-8 w-8 text-[#2196F3]" />
              </div>
              <h4 className="font-medium mb-1">In organic conversion</h4>
              <p className="text-sm text-center text-muted-foreground">
                15% of total area
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnvironmentalCharts;
