import { Cloud, CloudRain, Sun, Wind, Droplets, Eye } from 'lucide-react';
import { WeatherData, formatTemp, getWeatherDescription } from '@/lib/weatherApi';
import { Card } from '@/components/ui/card';

interface CurrentWeatherProps {
  data: WeatherData;
  backgroundImage?: string;
}

export function CurrentWeather({ data, backgroundImage }: CurrentWeatherProps) {
  const temp = formatTemp(data.main.temp);
  const feelsLike = formatTemp(data.main.feels_like);
  const weatherMain = data.weather[0]?.main || 'Unknown';
  const weatherDesc = data.weather[0]?.description || '';

  // Select weather icon based on condition
  const getWeatherIcon = () => {
    const main = weatherMain.toLowerCase();
    if (main.includes('clear') || main.includes('sunny')) {
      return <Sun className="w-24 h-24 text-yellow-400" />;
    } else if (main.includes('cloud')) {
      return <Cloud className="w-24 h-24 text-gray-400" />;
    } else if (main.includes('rain') || main.includes('drizzle')) {
      return <CloudRain className="w-24 h-24 text-blue-400" />;
    }
    return <Cloud className="w-24 h-24 text-gray-400" />;
  };

  return (
    <div
      className="relative rounded-3xl overflow-hidden mb-8 transition-all duration-700"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/40" />

      {/* Content */}
      <div className="relative p-8 md:p-12 text-white">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left side - Temperature and description */}
          <div className="flex-1">
            <h1 className="text-5xl md:text-7xl font-bold mb-2 drop-shadow-lg" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {temp}°
            </h1>
            <p className="text-xl md:text-2xl font-medium drop-shadow mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
              {getWeatherDescription(weatherMain, weatherDesc)}
            </p>
            <p className="text-lg md:text-xl text-white/90 drop-shadow" style={{ fontFamily: 'Inter, sans-serif' }}>
              Feels like {feelsLike}°
            </p>
            <p className="text-lg font-semibold mt-4 drop-shadow" style={{ fontFamily: 'Inter, sans-serif' }}>
              📍 {data.name}, {data.sys.country}
            </p>
          </div>

          {/* Right side - Weather icon */}
          <div className="flex justify-center md:justify-end drop-shadow-lg">
            {getWeatherIcon()}
          </div>
        </div>

        {/* Weather details grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-8 border-t border-white/20">
          {/* Humidity */}
          <div className="flex items-center gap-3">
            <Droplets className="w-6 h-6 text-blue-200" />
            <div>
              <p className="text-sm text-white/80" style={{ fontFamily: 'Inter, sans-serif' }}>Humidity</p>
              <p className="text-lg font-semibold" style={{ fontFamily: 'Poppins, sans-serif' }}>{data.main.humidity}%</p>
            </div>
          </div>

          {/* Wind Speed */}
          <div className="flex items-center gap-3">
            <Wind className="w-6 h-6 text-blue-200" />
            <div>
              <p className="text-sm text-white/80" style={{ fontFamily: 'Inter, sans-serif' }}>Wind</p>
              <p className="text-lg font-semibold" style={{ fontFamily: 'Poppins, sans-serif' }}>{data.wind.speed.toFixed(1)} m/s</p>
            </div>
          </div>

          {/* Visibility */}
          <div className="flex items-center gap-3">
            <Eye className="w-6 h-6 text-blue-200" />
            <div>
              <p className="text-sm text-white/80" style={{ fontFamily: 'Inter, sans-serif' }}>Visibility</p>
              <p className="text-lg font-semibold" style={{ fontFamily: 'Poppins, sans-serif' }}>{(data.visibility / 1000).toFixed(1)} km</p>
            </div>
          </div>

          {/* Pressure */}
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 flex items-center justify-center text-blue-200 font-bold">
              P
            </div>
            <div>
              <p className="text-sm text-white/80" style={{ fontFamily: 'Inter, sans-serif' }}>Pressure</p>
              <p className="text-lg font-semibold" style={{ fontFamily: 'Poppins, sans-serif' }}>{data.main.pressure} hPa</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
