/**
 * Open-Meteo free API, no key required.
 * https://open-meteo.com/en/docs
 */

const DEFAULT_LAT = 37.83;
const DEFAULT_LON = -122.13;

const WMO_WEATHER: Record<number, string> = {
  0: 'clear',
  1: 'mainly clear',
  2: 'partly cloudy',
  3: 'overcast',
  45: 'foggy',
  48: 'foggy',
  51: 'drizzle',
  53: 'drizzle',
  55: 'drizzle',
  61: 'rain',
  63: 'rain',
  65: 'rain',
  71: 'snow',
  73: 'snow',
  75: 'snow',
  80: 'rain showers',
  81: 'rain showers',
  82: 'rain showers',
  95: 'thunderstorm',
  96: 'thunderstorm',
  99: 'thunderstorm',
};

export type WeatherResult = {
  tempF: number;
  description: string;
};

export async function fetchWeather(): Promise<WeatherResult> {
  let lat = DEFAULT_LAT;
  let lon = DEFAULT_LON;

  try {
    const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
      if (!navigator.geolocation) reject(new Error('No geolocation'));
      navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 3000 });
    });
    lat = pos.coords.latitude;
    lon = pos.coords.longitude;
  } catch {
    // use default
  }

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&temperature_unit=fahrenheit`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Weather unavailable');
  const data = await res.json();
  const temp = data.current?.temperature_2m ?? null;
  const code = data.current?.weather_code ?? 0;
  const description = WMO_WEATHER[code] ?? 'clear';
  return {
    tempF: Math.round(Number(temp)),
    description,
  };
}
