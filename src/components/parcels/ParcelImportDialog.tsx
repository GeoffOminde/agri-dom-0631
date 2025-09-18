
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Map, Calendar, Filter } from 'lucide-react';

interface ParcelImportDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onImportConfirm: (importType: string) => void;
}

const ParcelImportDialog = ({ isOpen, onOpenChange, onImportConfirm }: ParcelImportDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import data</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-muted-foreground">Choose the type of data to import:</p>
          <div className="grid grid-cols-1 gap-2">
            <Button variant="outline" className="justify-start" onClick={() => onImportConfirm('parcel')}>
              <Map className="h-4 w-4 mr-2" />
              Parcel data (CSV)
            </Button>
            <Button variant="outline" className="justify-start" onClick={() => onImportConfirm('geospatial')}>
              <Calendar className="h-4 w-4 mr-2" />
              Geospatial data (GeoJSON)
            </Button>
            <Button variant="outline" className="justify-start" onClick={() => onImportConfirm('crop-history')}>
              <Filter className="h-4 w-4 mr-2" />
              Crop history (Excel)
            </Button>
          </div>
          <div className="flex justify-end">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ParcelImportDialog;
