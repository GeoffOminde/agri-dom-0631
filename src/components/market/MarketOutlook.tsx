import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getWeeklyPriceForecast, getSellRecommendation, PriceForecast } from '@/services/priceForecastService';
import { useAppSettings } from '@/contexts/AppSettingsContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface MarketOutlookProps {
  defaultCrop?: string;
  defaultMarket?: string;
}

const crops = ['Maize', 'Beans', 'Banana', 'Tomato', 'Onion'];
const markets = ['Nairobi', 'Mombasa', 'Kisumu', 'Eldoret'];

const recText: Record<ReturnType<typeof getSellRecommendation>, string> = {
  sell_now: 'Consider selling now. Forecast shows a potential decline.',
  hold: 'Hold. Prices are expected to improve.',
  watch: 'Watch the market. No strong signal detected.'
};

const MarketOutlook: React.FC<MarketOutlookProps> = ({ defaultCrop, defaultMarket }) => {
  const { settings } = useAppSettings();
  const initCrop = defaultCrop ?? settings.market?.crop ?? 'Maize';
  const initMarket = defaultMarket ?? settings.market?.location ?? 'Nairobi';
  const [crop, setCrop] = useState(initCrop);
  const [market, setMarket] = useState(initMarket);
  const [data, setData] = useState<PriceForecast | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const f = await getWeeklyPriceForecast(crop, market, 8);
      if (!mounted) return;
      setData(f);
      setLoading(false);
    })();
    return () => { mounted = false; };
  }, [crop, market]);

  const recommendation = data ? getSellRecommendation(data) : 'watch';

  const chartData = data ? [
    ...data.history.map(h => ({ date: h.date, History: h.priceKSh })),
    ...data.forecast.map(f => ({ date: f.date, Forecast: f.priceKSh }))
  ] : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Outlook</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          <Select value={crop} onValueChange={setCrop}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="Crop" /></SelectTrigger>
            <SelectContent>
              {crops.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={market} onValueChange={setMarket}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="Market" /></SelectTrigger>
            <SelectContent>
              {markets.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {loading || !data ? (
          <p className="text-sm text-muted-foreground">Loading price forecast…</p>
        ) : (
          <>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tickFormatter={(v) => `${v} KSh`} />
                  <Tooltip formatter={(val: any, name: any) => [`${val} KSh`, name]} />
                  <Legend />
                  <Line type="monotone" dataKey="History" stroke="#8884d8" dot={false} />
                  <Line type="monotone" dataKey="Forecast" stroke="#82ca9d" dot={false} strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-3 p-3 rounded-md border">
              <p className="text-sm font-medium">Recommendation</p>
              <p className="text-sm text-muted-foreground">{recText[recommendation]}</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default MarketOutlook;
