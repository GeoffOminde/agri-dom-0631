// Simple price forecast service stub
// In production, connect to commodity price APIs and use robust time-series models

export type PricePoint = {
  date: string; // ISO date
  priceKSh: number;
};

export type PriceForecast = {
  crop: string;
  market: string;
  horizonWeeks: number;
  history: PricePoint[];
  forecast: PricePoint[];
};

function seededRandom(seed: number) {
  // deterministic pseudo-random for repeatable mock data
  return () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

export async function getWeeklyPriceForecast(
  crop: string,
  market: string,
  horizonWeeks = 8
): Promise<PriceForecast> {
  const now = new Date();
  const rng = seededRandom(crop.length + market.length);
  const base = 80 + Math.round(rng() * 40) * 10; // base price

  // generate 12w history
  const history = Array.from({ length: 12 }).map((_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (12 - i) * 7);
    return {
      date: d.toISOString().slice(0, 10),
      priceKSh: Math.max(20, base + Math.round((rng() - 0.5) * 20) * 10),
    };
  });

  // naive forecast with slight trend
  const last = history[history.length - 1].priceKSh;
  const forecast = Array.from({ length: horizonWeeks }).map((_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() + (i + 1) * 7);
    const drift = (i + 1) * (rng() - 0.5) * 15;
    return {
      date: d.toISOString().slice(0, 10),
      priceKSh: Math.max(20, Math.round(last + drift)),
    };
  });

  return { crop, market, horizonWeeks, history, forecast };
}

export function getSellRecommendation(forecast: PriceForecast): 'sell_now' | 'hold' | 'watch' {
  const current = forecast.history[forecast.history.length - 1]?.priceKSh || 0;
  const peak = Math.max(...forecast.forecast.map(p => p.priceKSh));
  if (peak > current * 1.1) return 'hold';
  if (peak < current * 0.95) return 'sell_now';
  return 'watch';
}
