import { useState, useEffect } from 'react';
import { SearchBar } from '@/components/SearchBar';
import { CurrentWeather } from '@/components/CurrentWeather';
import { ForecastCard } from '@/components/ForecastCard';
import { getCurrentWeather, getForecast, WeatherData, ForecastData, mockWeatherData, mockForecastData } from '@/lib/weatherApi';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';

/**
 * Design Philosophy: Modern Minimalist with Atmospheric Depth
 * - Dynamic backgrounds based on weather conditions
 * - Clean typography hierarchy with Poppins (display) and Inter (body)
 * - Glass morphism cards with subtle animations
 * - Responsive grid layout for forecast
 */

export default function Home() {
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState<string>('');

  // Initial load with Jakarta
  useEffect(() => {
    loadWeatherData('Jakarta');
  }, []);

  const loadWeatherData = async (city: string) => {
    setIsLoading(true);
    try {
      const [weatherData, forecastData] = await Promise.all([
        getCurrentWeather(city),
        getForecast(city),
      ]);

      setCurrentWeather(weatherData);
      setForecast(forecastData);

      // Set background based on weather condition
      const weatherMain = weatherData.weather[0]?.main || '';
      if (weatherMain.toLowerCase().includes('clear') || weatherMain.toLowerCase().includes('sunny')) {
        setBackgroundImage('https://d2xsxph8kpxj0f.cloudfront.net/310519663696390710/hN5x2isznCgojgsWy4SSro/weather-sunny-YcEtNSa6a8z5y3DnkK8eB2.webp');
      } else if (weatherMain.toLowerCase().includes('cloud')) {
        setBackgroundImage('https://d2xsxph8kpxj0f.cloudfront.net/310519663696390710/hN5x2isznCgojgsWy4SSro/weather-cloudy-8u7V8WqhWS7yTYYme9XPGp.webp');
      } else if (weatherMain.toLowerCase().includes('rain')) {
        setBackgroundImage('https://d2xsxph8kpxj0f.cloudfront.net/310519663696390710/hN5x2isznCgojgsWy4SSro/weather-cloudy-8u7V8WqhWS7yTYYme9XPGp.webp');
      } else {
        setBackgroundImage('https://d2xsxph8kpxj0f.cloudfront.net/310519663696390710/hN5x2isznCgojgsWy4SSro/weather-night-mBxEAQ7xuNSiPkzqCqTZts.webp');
      }

      toast.success(`Weather loaded for ${weatherData.name}`);
    } catch (error: any) {
      const errMsg = error instanceof Error ? error.message : 'Failed to load weather data';
      toast.error(errMsg);
      console.error('Error loading weather:', error);
      
      // Fallback to mock data if there is no weather data loaded yet (e.g. offline on initial load)
      if (!currentWeather) {
        setCurrentWeather(mockWeatherData);
        setForecast(mockForecastData);
        setBackgroundImage('https://d2xsxph8kpxj0f.cloudfront.net/310519663696390710/hN5x2isznCgojgsWy4SSro/weather-sunny-YcEtNSa6a8z5y3DnkK8eB2.webp');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Get daily forecast (one entry per day)
  const getDailyForecast = () => {
    if (!forecast) return [];

    const dailyData: typeof forecast.list = [];
    const seenDays = new Set<string>();

    for (const item of forecast.list) {
      const date = new Date(item.dt * 1000);
      const dayKey = date.toDateString();

      if (!seenDays.has(dayKey)) {
        seenDays.add(dayKey);
        dailyData.push(item);
      }

      if (dailyData.length === 5) break;
    }

    return dailyData;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg" style={{ fontFamily: 'Poppins, sans-serif' }}>W</span>
              </div>
              <h1 className="font-bold text-2xl text-gray-800" style={{ fontFamily: 'Poppins, sans-serif' }}>Weather App</h1>
            </div>
            <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>Real-time weather forecast</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        {/* Search Bar */}
        <SearchBar onSearch={loadWeatherData} isLoading={isLoading} />

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <Spinner className="w-12 h-12 text-blue-500" />
          </div>
        )}

        {/* Current Weather */}
        {currentWeather && !isLoading && (
          <>
            <CurrentWeather data={currentWeather} backgroundImage={backgroundImage} />

            {/* Forecast Section */}
            <div className="mt-12">
              <h2 className="font-bold text-3xl text-gray-800 mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>5-Day Forecast</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {getDailyForecast().map((item, index) => (
                  <div
                    key={index}
                    className="animate-in fade-in slide-in-from-bottom-4"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <ForecastCard
                      date={new Date(item.dt * 1000)}
                      temp={item.main.temp}
                      tempMin={item.main.temp_min}
                      tempMax={item.main.temp_max}
                      weatherMain={item.weather[0]?.main || 'Unknown'}
                      weatherDesc={item.weather[0]?.description || ''}
                      humidity={item.main.humidity}
                      windSpeed={item.wind.speed}
                      rainProbability={item.pop}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Info Section */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Temperature Range */}
              <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-white/40">
                <h3 className="font-semibold text-lg text-gray-800 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>Temperature Range</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>Today's High</span>
                    <span className="font-bold text-xl text-red-500" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      {Math.round(currentWeather.main.temp_max)}°C
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>Today's Low</span>
                    <span className="font-bold text-xl text-blue-500" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      {Math.round(currentWeather.main.temp_min)}°C
                    </span>
                  </div>
                </div>
              </div>

              {/* Air Quality */}
              <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-white/40">
                <h3 className="font-semibold text-lg text-gray-800 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>Air Quality</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>Visibility</span>
                    <span className="font-bold text-xl text-gray-800" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      {(currentWeather.visibility / 1000).toFixed(1)} km
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>Cloud Cover</span>
                    <span className="font-bold text-xl text-gray-800" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      {currentWeather.clouds.all}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white/50 backdrop-blur-md mt-16">
        <div className="container py-6 text-center">
          <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
            Weather data provided by{' '}
            <a
              href="https://openweathermap.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600 font-semibold transition-colors"
            >
              OpenWeatherMap
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
