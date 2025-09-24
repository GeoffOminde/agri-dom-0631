import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { Advisory, WeatherSummary, computeAdvisories, get7DayForecast } from '@/services/weatherService';
import { useAppSettings } from '@/contexts/AppSettingsContext';

interface AdvisoriesPanelProps {
  lat?: number;
  lng?: number;
  title?: string;
}

const iconFor = (severity: Advisory['severity']) => {
  switch (severity) {
    case 'good':
      return <CheckCircle2 className="h-4 w-4 text-green-600" />;
    case 'caution':
      return <AlertTriangle className="h-4 w-4 text-amber-600" />;
    default:
      return <Info className="h-4 w-4 text-blue-600" />;
  }
};

const labelFor = (type: Advisory['type']) => {
  switch (type) {
    case 'planting_window': return 'Planting window';
    case 'spray_window': return 'Spraying window';
    case 'fertilize_window': return 'Fertilization window';
    case 'harvest_window': return 'Harvest window';
  }
};

const AdvisoriesPanel: React.FC<AdvisoriesPanelProps> = ({ lat, lng, title = 'Weather-aware advisories (7 days)' }) => {
  const { settings } = useAppSettings();
  const effLat = lat ?? settings.farm?.lat ?? -1.286389;
  const effLng = lng ?? settings.farm?.lng ?? 36.817223;
  const [forecast, setForecast] = useState<WeatherSummary | null>(null);
  const [advisories, setAdvisories] = useState<Advisory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const f = await get7DayForecast(effLat, effLng);
      if (!mounted) return;
      setForecast(f);
      setAdvisories(computeAdvisories(f));
      setLoading(false);
    })();
    return () => { mounted = false; };
  }, [effLat, effLng]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading advisories…</p>
        ) : advisories.length === 0 ? (
          <p className="text-sm text-muted-foreground">No advisories for the next 7 days.</p>
        ) : (
          <div className="space-y-2">
            {advisories.map((a, idx) => (
              <div key={idx} className="flex items-start gap-2 p-2 border rounded-md">
                <div className="mt-0.5">{iconFor(a.severity)}</div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{labelFor(a.type)} • {new Date(a.date).toLocaleDateString()}</div>
                  <div className="text-sm text-muted-foreground">{a.message}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdvisoriesPanel;
