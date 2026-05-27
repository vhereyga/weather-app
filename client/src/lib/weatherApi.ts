// Weather API Configuration
const API_KEY = '1e6e4c2f8988d3f2b1421b9fc3d7c663';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export interface WeatherData {
  coord: { lon: number; lat: number };
  weather: Array<{ id: number; main: string; description: string; icon: string }>;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  visibility: number;
  wind: { speed: number; deg: number };
  clouds: { all: number };
  dt: number;
  sys: { country: string; sunrise: number; sunset: number };
  timezone: number;
  name: string;
  id: number;
}

export interface ForecastData {
  list: Array<{
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      pressure: number;
      humidity: number;
    };
    weather: Array<{ id: number; main: string; description: string; icon: string }>;
    clouds: { all: number };
    wind: { speed: number; deg: number };
    visibility: number;
    pop: number;
    sys: { pod: string };
    dt_txt: string;
  }>;
  city: {
    id: number;
    name: string;
    coord: { lat: number; lon: number };
    country: string;
    timezone: number;
  };
}

// Mock data untuk fallback
export const mockWeatherData: WeatherData = {
  coord: { lon: 106.8451, lat: -6.2146 },
  weather: [{ id: 801, main: 'Clouds', description: 'few clouds', icon: '02d' }],
  main: {
    temp: 28.5,
    feels_like: 29.2,
    temp_min: 26.1,
    temp_max: 30.3,
    pressure: 1012,
    humidity: 72,
  },
  visibility: 10000,
  wind: { speed: 3.5, deg: 230 },
  clouds: { all: 20 },
  dt: Math.floor(Date.now() / 1000),
  sys: {
    country: 'ID',
    sunrise: Math.floor(Date.now() / 1000) - 3600,
    sunset: Math.floor(Date.now() / 1000) + 7200,
  },
  timezone: 25200,
  name: 'Jakarta',
  id: 1642911,
};

export const mockForecastData: ForecastData = {
  list: [
    {
      dt: Math.floor(Date.now() / 1000) + 86400,
      main: { temp: 29.1, feels_like: 29.8, temp_min: 27.2, temp_max: 31.0, pressure: 1011, humidity: 68 },
      weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
      clouds: { all: 5 },
      wind: { speed: 2.8, deg: 220 },
      visibility: 10000,
      pop: 0,
      sys: { pod: 'd' },
      dt_txt: new Date(Date.now() + 86400000).toISOString(),
    },
    {
      dt: Math.floor(Date.now() / 1000) + 172800,
      main: { temp: 27.8, feels_like: 28.5, temp_min: 25.9, temp_max: 29.5, pressure: 1013, humidity: 75 },
      weather: [{ id: 803, main: 'Clouds', description: 'broken clouds', icon: '04d' }],
      clouds: { all: 75 },
      wind: { speed: 4.2, deg: 240 },
      visibility: 9500,
      pop: 0.2,
      sys: { pod: 'd' },
      dt_txt: new Date(Date.now() + 172800000).toISOString(),
    },
    {
      dt: Math.floor(Date.now() / 1000) + 259200,
      main: { temp: 26.5, feels_like: 27.2, temp_min: 24.8, temp_max: 28.2, pressure: 1010, humidity: 82 },
      weather: [{ id: 500, main: 'Rain', description: 'light rain', icon: '10d' }],
      clouds: { all: 90 },
      wind: { speed: 5.1, deg: 250 },
      visibility: 8000,
      pop: 0.6,
      sys: { pod: 'd' },
      dt_txt: new Date(Date.now() + 259200000).toISOString(),
    },
    {
      dt: Math.floor(Date.now() / 1000) + 345600,
      main: { temp: 25.9, feels_like: 26.6, temp_min: 24.2, temp_max: 27.5, pressure: 1011, humidity: 80 },
      weather: [{ id: 500, main: 'Rain', description: 'light rain', icon: '10d' }],
      clouds: { all: 85 },
      wind: { speed: 4.8, deg: 245 },
      visibility: 8500,
      pop: 0.5,
      sys: { pod: 'd' },
      dt_txt: new Date(Date.now() + 345600000).toISOString(),
    },
    {
      dt: Math.floor(Date.now() / 1000) + 432000,
      main: { temp: 28.2, feels_like: 28.9, temp_min: 26.5, temp_max: 30.0, pressure: 1012, humidity: 70 },
      weather: [{ id: 802, main: 'Clouds', description: 'scattered clouds', icon: '03d' }],
      clouds: { all: 40 },
      wind: { speed: 3.2, deg: 225 },
      visibility: 10000,
      pop: 0.1,
      sys: { pod: 'd' },
      dt_txt: new Date(Date.now() + 432000000).toISOString(),
    },
  ],
  city: {
    id: 1642911,
    name: 'Jakarta',
    coord: { lat: -6.2146, lon: 106.8451 },
    country: 'ID',
    timezone: 25200,
  },
};

// Fetch current weather
export async function getCurrentWeather(city: string): Promise<WeatherData> {
  const response = await fetch(
    `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`
  );
  if (response.status === 404) {
    throw new Error('City not found');
  }
  if (!response.ok) {
    throw new Error('Failed to fetch weather data');
  }
  return await response.json();
}

// Fetch 5-day forecast
export async function getForecast(city: string): Promise<ForecastData> {
  const response = await fetch(
    `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`
  );
  if (response.status === 404) {
    throw new Error('City not found');
  }
  if (!response.ok) {
    throw new Error('Failed to fetch forecast data');
  }
  return await response.json();
}

// Get weather icon URL
export function getWeatherIconUrl(iconCode: string): string {
  return `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
}

// Format temperature
export function formatTemp(temp: number): string {
  return Math.round(temp).toString();
}

// Get weather background based on condition
export function getWeatherBackground(weatherMain: string): string {
  const main = weatherMain.toLowerCase();
  if (main.includes('clear') || main.includes('sunny')) {
    return 'from-blue-400 via-blue-300 to-yellow-200';
  } else if (main.includes('cloud')) {
    return 'from-gray-400 via-gray-300 to-blue-200';
  } else if (main.includes('rain') || main.includes('drizzle')) {
    return 'from-gray-500 via-gray-400 to-blue-300';
  } else if (main.includes('snow')) {
    return 'from-blue-200 via-gray-100 to-blue-100';
  } else if (main.includes('thunder')) {
    return 'from-gray-600 via-gray-500 to-blue-400';
  }
  return 'from-blue-400 to-blue-300';
}

// Get weather description
export function getWeatherDescription(main: string, description: string): string {
  return description.charAt(0).toUpperCase() + description.slice(1);
}
