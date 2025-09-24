import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useAppSettings } from '@/contexts/AppSettingsContext';

interface AppSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const crops = ['Maize', 'Beans', 'Banana', 'Tomato', 'Onion'];
const markets = ['Nairobi', 'Mombasa', 'Kisumu', 'Eldoret'];

const AppSettingsDialog: React.FC<AppSettingsDialogProps> = ({ open, onOpenChange }) => {
  const { settings, updateNestedSetting } = useAppSettings();
  const [lat, setLat] = useState<number>(settings.farm?.lat ?? -1.286389);
  const [lng, setLng] = useState<number>(settings.farm?.lng ?? 36.817223);
  const [crop, setCrop] = useState<string>(settings.market?.crop ?? 'Maize');
  const [market, setMarket] = useState<string>(settings.market?.location ?? 'Nairobi');

  const save = () => {
    updateNestedSetting('farm', 'lat', lat);
    updateNestedSetting('farm', 'lng', lng);
    updateNestedSetting('market', 'crop', crop);
    updateNestedSetting('market', 'location', market);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>App Settings</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="lat" className="text-right">Farm lat</Label>
            <Input id="lat" type="number" value={lat} onChange={(e) => setLat(parseFloat(e.target.value))} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="lng" className="text-right">Farm lng</Label>
            <Input id="lng" type="number" value={lng} onChange={(e) => setLng(parseFloat(e.target.value))} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Default crop</Label>
            <Select value={crop} onValueChange={setCrop}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Crop" />
              </SelectTrigger>
              <SelectContent>
                {crops.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Default market</Label>
            <Select value={market} onValueChange={setMarket}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Market" />
              </SelectTrigger>
              <SelectContent>
                {markets.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={save}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AppSettingsDialog;
