
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import ParcelMap from '@/components/ParcelMap';
import { Search, ZoomIn, ZoomOut, Maximize2, Download, Layers, Ruler, MapPin, Target } from 'lucide-react';
import { toast } from 'sonner';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from '@/components/ui/checkbox';

interface Layer {
  id: string;
  name: string;
  enabled: boolean;
  type: 'base' | 'overlay';
}

interface ParcelMapDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const ParcelMapDialog = ({ isOpen, onOpenChange }: ParcelMapDialogProps) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [coordinates, setCoordinates] = useState({ lat: 0, lng: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [measureMode, setMeasureMode] = useState(false);
  const [measureResult, setMeasureResult] = useState<string | null>(null);
  const [layersOpen, setLayersOpen] = useState(false);
  const [mapLayers, setMapLayers] = useState<Layer[]>([
    { id: 'satellite', name: 'Satellite view', enabled: false, type: 'base' },
    { id: 'terrain', name: 'Terrain', enabled: true, type: 'base' },
    { id: 'parcels', name: 'Parcel boundaries', enabled: true, type: 'overlay' },
    { id: 'crops', name: 'Current crops', enabled: true, type: 'overlay' },
    { id: 'soil', name: 'Soil types', enabled: false, type: 'overlay' },
    { id: 'irrigation', name: 'Irrigation', enabled: false, type: 'overlay' },
  ]);
  
  const handleZoomIn = () => {
    if (zoomLevel < 3) {
      setZoomLevel(zoomLevel + 0.5);
    }
  };
  
  const handleZoomOut = () => {
    if (zoomLevel > 0.5) {
      setZoomLevel(zoomLevel - 0.5);
    }
  };
  
  const handleResetView = () => {
    setZoomLevel(1);
    setCoordinates((prev) => prev);
  };
  
  const handleExportMap = () => {
    toast.success("Map export", {
      description: "The parcel map has been exported to PDF"
    });
  };

  const toggleMeasureMode = () => {
    const newMode = !measureMode;
    setMeasureMode(newMode);
    
    if (newMode) {
      toast.info("Measurement mode enabled", {
        description: "Click on the map to place points and measure distance"
      });
    } else {
      setMeasureResult(null);
    }
  };

  const handleLayerChange = (layerId: string, enabled: boolean) => {
    setMapLayers(mapLayers.map(layer => 
      layer.id === layerId ? { ...layer, enabled } : layer
    ));
    
    // If a base layer is enabled, disable the other base layers
    if (enabled) {
      const layer = mapLayers.find(l => l.id === layerId);
      if (layer?.type === 'base') {
        setMapLayers(mapLayers.map(l => 
          l.type === 'base' ? { ...l, enabled: l.id === layerId } : l
        ));
      }
    }
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Simulate a parcel search on the map
    toast.info("Searching", {
      description: `Searching parcel: ${searchQuery}`
    });

    // Simulate a result found
    setTimeout(() => {
      setCoordinates({ lat: 45.4831, lng: 4.3973 });
      setZoomLevel(2);
      toast.success("Parcel found", {
        description: "The map has been centered on the searched parcel"
      });
    }, 1000);
  };

  const simulateMeasurement = () => {
    if (measureMode) {
      setMeasureResult("Distance: 245.3 meters");
    }
  };

  // Activer la mesure sur la carte
  useEffect(() => {
    if (isOpen && measureMode) {
      const timer = setTimeout(simulateMeasurement, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, measureMode]);

  // Center to user's geolocation when dialog opens
  useEffect(() => {
    if (!isOpen) return;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoordinates({ lat: latitude, lng: longitude });
          setZoomLevel(2);
        },
        () => {
          // Fallback to a neutral center if denied
          setCoordinates({ lat: -1.286389, lng: 36.817223 }); // Nairobi, Kenya
        }
      );
    } else {
      setCoordinates({ lat: -1.286389, lng: 36.817223 }); // Nairobi, Kenya
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Parcel map</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <form onSubmit={handleSearch} className="flex-grow mr-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input 
                  type="text"
                  placeholder="Search for a parcel..."
                  className="pl-9 pr-4 py-2 w-full border rounded-md"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>
            <div className="flex space-x-2">
              <Button variant="outline" size="icon" onClick={handleZoomIn}>
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleZoomOut}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleResetView}>
                <Maximize2 className="h-4 w-4" />
              </Button>
              <Popover open={layersOpen} onOpenChange={setLayersOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Layers className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56">
                  <div className="space-y-4">
                    <h4 className="font-medium text-sm">Base layers</h4>
                    <div className="space-y-2">
                      {mapLayers.filter(l => l.type === 'base').map(layer => (
                        <div key={layer.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`layer-${layer.id}`} 
                            checked={layer.enabled}
                            onCheckedChange={(checked) => handleLayerChange(layer.id, checked === true)}
                          />
                          <label 
                            htmlFor={`layer-${layer.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {layer.name}
                          </label>
                        </div>
                      ))}
                    </div>
                    
                    <h4 className="font-medium text-sm">Additional layers</h4>
                    <div className="space-y-2">
                      {mapLayers.filter(l => l.type === 'overlay').map(layer => (
                        <div key={layer.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`layer-${layer.id}`} 
                            checked={layer.enabled}
                            onCheckedChange={(checked) => handleLayerChange(layer.id, checked === true)}
                          />
                          <label 
                            htmlFor={`layer-${layer.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {layer.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <Button 
                variant={measureMode ? "default" : "outline"} 
                size="icon" 
                onClick={toggleMeasureMode}
                className={measureMode ? "bg-agri-primary text-white" : ""}
              >
                <Ruler className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleExportMap}>
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="h-[500px] bg-gray-100 rounded-lg overflow-hidden relative" style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}>
            <ParcelMap 
              coordinates={coordinates}
              parcelName="Overview"
              isEditing={false}
              onCoordinatesChange={setCoordinates}
            />
            
            {/* Measurement mode - indicators */}
            {measureMode && (
              <div className="absolute top-2 left-2 bg-white/90 p-2 rounded-md shadow-md">
                <div className="flex items-center text-sm">
                  <Ruler className="h-4 w-4 mr-1 text-agri-primary" />
                  <span className="font-medium">Measurement mode enabled</span>
                </div>
                {measureResult && (
                  <div className="text-sm mt-1 font-bold">{measureResult}</div>
                )}
              </div>
            )}
            
            {/* Active layers - legend */}
            <div className="absolute bottom-2 right-2 bg-white/90 p-2 rounded-md shadow-md max-w-xs">
              <div className="text-xs font-medium mb-1">Active layers:</div>
              <div className="flex flex-wrap gap-1">
                {mapLayers.filter(layer => layer.enabled).map(layer => (
                  <span 
                    key={layer.id}
                    className="text-xs px-2 py-0.5 bg-agri-primary/10 text-agri-primary rounded-full"
                  >
                    {layer.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground text-center">
            This overview shows the location of all your parcels. 
            Click on a specific parcel to see more details.
          </p>
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => {
                navigator.geolocation.getCurrentPosition((position) => {
                  const { latitude, longitude } = position.coords;
                  setCoordinates({ lat: latitude, lng: longitude });
                  setZoomLevel(2.5);
                  toast.success("Location", {
                    description: "Map centered on your position"
                  });
                }, () => {
                  toast.error("Location", {
                    description: "Unable to get your position"
                  });
                });
              }}
              className="gap-2"
            >
              <Target className="h-4 w-4" />
              My position
            </Button>
            <Button onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ParcelMapDialog;
