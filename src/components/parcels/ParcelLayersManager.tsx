
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Layers, Eye, EyeOff, Info } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from 'sonner';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Layer {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  type: 'base' | 'overlay';
  source: 'local' | 'remote';
}

interface ParcelLayersManagerProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const ParcelLayersManager = ({ isOpen, onOpenChange }: ParcelLayersManagerProps) => {
  const [layers, setLayers] = useState<Layer[]>([
    { 
      id: 'satellite', 
      name: 'Satellite imagery', 
      description: 'High-resolution satellite aerial view',
      enabled: false, 
      type: 'base',
      source: 'remote'
    },
    { 
      id: 'terrain', 
      name: 'Topographic map', 
      description: 'Contour lines and terrain elevation',
      enabled: true, 
      type: 'base',
      source: 'remote'
    },
    { 
      id: 'parcels', 
      name: 'Parcel boundaries', 
      description: 'Geographic boundaries of parcels',
      enabled: true, 
      type: 'overlay',
      source: 'local'
    },
    { 
      id: 'crops', 
      name: 'Current crops', 
      description: 'Crop types per parcel',
      enabled: true, 
      type: 'overlay',
      source: 'local'
    },
    { 
      id: 'soil', 
      name: 'Soil types', 
      description: 'Soil classification by type',
      enabled: false, 
      type: 'overlay',
      source: 'local'
    },
    { 
      id: 'irrigation', 
      name: 'Irrigation network', 
      description: 'Installed irrigation systems',
      enabled: false, 
      type: 'overlay',
      source: 'local'
    },
    { 
      id: 'ndvi', 
      name: 'NDVI', 
      description: 'Normalized Difference Vegetation Index',
      enabled: false, 
      type: 'overlay',
      source: 'remote'
    },
    { 
      id: 'rainfall', 
      name: 'Rainfall', 
      description: 'Precipitation data over 30 days',
      enabled: false, 
      type: 'overlay',
      source: 'remote'
    },
  ]);

  const handleLayerChange = (layerId: string, enabled: boolean) => {
    setLayers(layers.map(layer => 
      layer.id === layerId ? { ...layer, enabled } : layer
    ));
    
    // If a base layer is enabled, disable other base layers
    if (enabled) {
      const layer = layers.find(l => l.id === layerId);
      if (layer?.type === 'base') {
        setLayers(layers.map(l => 
          l.type === 'base' ? { ...l, enabled: l.id === layerId } : l
        ));
      }
    }

    toast.success("Layer updated", {
      description: `Layer "${layers.find(l => l.id === layerId)?.name}" has been ${enabled ? 'enabled' : 'disabled'}`
    });
  };

  const handleSaveLayers = () => {
    toast.success("Configuration saved", {
      description: "Layer configuration has been saved"
    });
    onOpenChange(false);
  };

  const handleResetLayers = () => {
    setLayers(layers.map(layer => ({
      ...layer,
      enabled: layer.id === 'terrain' || layer.id === 'parcels'
    })));
    
    toast.info("Configuration reset", {
      description: "Layer configuration has been reset to default"
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Layers className="h-5 w-5 mr-2" />
            Layer manager
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <p className="text-sm text-muted-foreground">
            Configure the visible layers on the map to customize your parcel view.
          </p>
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Base layers</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {layers.filter(l => l.type === 'base').map(layer => (
                <div 
                  key={layer.id} 
                  className={`p-3 border rounded-lg ${layer.enabled ? 'border-agri-primary bg-agri-primary/5' : 'border-input'}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Checkbox 
                        id={`layer-${layer.id}`} 
                        checked={layer.enabled}
                        onCheckedChange={(checked) => handleLayerChange(layer.id, checked === true)}
                        className="mr-2"
                      />
                      <label 
                        htmlFor={`layer-${layer.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {layer.name}
                      </label>
                    </div>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="text-muted-foreground cursor-help">
                            <Info className="h-4 w-4" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{layer.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mt-2 pl-6">
                    Source: {layer.source === 'local' ? 'Local' : 'External service'}
                  </p>
                </div>
              ))}
            </div>
            
            <h3 className="text-sm font-medium mt-6">Thematic layers</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {layers.filter(l => l.type === 'overlay').map(layer => (
                <div 
                  key={layer.id} 
                  className={`p-3 border rounded-lg ${layer.enabled ? 'border-agri-primary bg-agri-primary/5' : 'border-input'}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Checkbox 
                        id={`layer-${layer.id}`} 
                        checked={layer.enabled}
                        onCheckedChange={(checked) => handleLayerChange(layer.id, checked === true)}
                        className="mr-2"
                      />
                      <label 
                        htmlFor={`layer-${layer.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {layer.name}
                      </label>
                    </div>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="text-muted-foreground cursor-help">
                            <Info className="h-4 w-4" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{layer.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mt-2 pl-6">
                    Source: {layer.source === 'local' ? 'Local' : 'External service'}
                  </p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={handleResetLayers}>
              Reset
            </Button>
            <div className="space-x-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveLayers}>
                Save configuration
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ParcelLayersManager;
