// Simple weather service stub for weather-aware recommendations
// In production, integrate with OpenWeather/Tomorrow.io and secure API keys via environment variables

export type DailyForecast = {
  date: string; // ISO date
  tempMinC: number;
  tempMaxC: number;
  precipitationMm: number;
  windKph: number;
  humidity: number; // %
};

export type WeatherSummary = {
  location: { lat: number; lng: number };
  days: DailyForecast[];
};

export async function get7DayForecast(lat: number, lng: number): Promise<WeatherSummary> {
  // Placeholder mocked data (deterministic per coordinates)
  const base = Math.abs(Math.round(lat * 10 + lng));
  const today = new Date();
  const days: DailyForecast[] = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return {
      date: d.toISOString().slice(0, 10),
      tempMinC: 16 + ((base + i) % 5),
      tempMaxC: 24 + ((base + i) % 8),
      precipitationMm: ((base + i * 3) % 10) < 4 ? 0 : ((base + i) % 15),
      windKph: 8 + ((base + i * 2) % 20),
      humidity: 55 + ((base + i) % 40),
    };
  });
  return { location: { lat, lng }, days };
}

export type Advisory = {
  date: string;
  type: 'planting_window' | 'spray_window' | 'fertilize_window' | 'harvest_window';
  message: string;
  severity: 'info' | 'good' | 'caution';
};

export function computeAdvisories(forecast: WeatherSummary): Advisory[] {
  // Simple heuristics:
  // - Spray window: low wind (< 15 kph) and no rain (< 1 mm)
  // - Planting window: rain between 2-10 mm and moderate temps
  // - Fertilize: no heavy rain (< 5 mm) and humidity < 85
  const out: Advisory[] = [];
  for (const d of forecast.days) {
    if (d.windKph < 15 && d.precipitationMm < 1) {
      out.push({
        date: d.date,
        type: 'spray_window',
        message: 'Good spraying conditions (low wind, no rain expected).',
        severity: 'good',
      });
    }
    if (d.precipitationMm >= 2 && d.precipitationMm <= 10 && d.tempMaxC <= 30) {
      out.push({
        date: d.date,
        type: 'planting_window',
        message: 'Favorable planting window (adequate moisture expected).',
        severity: 'good',
      });
    }
    if (d.precipitationMm < 5 && d.humidity < 85) {
      out.push({
        date: d.date,
        type: 'fertilize_window',
        message: 'Suitable for fertilization (low runoff risk).',
        severity: 'info',
      });
    }
  }
  return out;
}
