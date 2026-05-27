import { Cloud, CloudRain, Sun, CloudSnow, CloudDrizzle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { formatTemp } from '@/lib/weatherApi';

interface ForecastCardProps {
  date: Date;
  temp: number;
  tempMin: number;
  tempMax: number;
  weatherMain: string;
  weatherDesc: string;
  humidity: number;
  windSpeed: number;
  rainProbability: number;
}

export function ForecastCard({
  date,
  temp,
  tempMin,
  tempMax,
  weatherMain,
  weatherDesc,
  humidity,
  windSpeed,
  rainProbability,
}: ForecastCardProps) {
  const getWeatherIcon = () => {
    const main = weatherMain.toLowerCase();
    if (main.includes('clear') || main.includes('sunny')) {
      return <Sun className="w-12 h-12 text-yellow-400" />;
    } else if (main.includes('cloud')) {
      return <Cloud className="w-12 h-12 text-gray-400" />;
    } else if (main.includes('rain') || main.includes('drizzle')) {
      return <CloudRain className="w-12 h-12 text-blue-500" />;
    } else if (main.includes('snow')) {
      return <CloudSnow className="w-12 h-12 text-blue-300" />;
    }
    return <Cloud className="w-12 h-12 text-gray-400" />;
  };

  const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
  const dayDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <Card className="p-4 backdrop-blur-md bg-white/80 hover:bg-white/95 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-white/40">
      <div className="flex flex-col items-center gap-3">
        {/* Date */}
        <div className="text-center">
          <p className="font-semibold text-sm text-gray-700" style={{ fontFamily: 'Poppins, sans-serif' }}>{dayName}</p>
          <p className="text-xs text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>{dayDate}</p>
        </div>

        {/* Weather Icon */}
        <div className="flex justify-center py-2">
          {getWeatherIcon()}
        </div>

        {/* Temperature */}
        <div className="text-center">
          <p className="font-bold text-lg text-gray-800" style={{ fontFamily: 'Poppins, sans-serif' }}>{formatTemp(temp)}°</p>
          <p className="text-xs text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
            {formatTemp(tempMin)}° - {formatTemp(tempMax)}°
          </p>
        </div>

        {/* Weather description */}
        <p className="text-xs text-gray-600 text-center capitalize line-clamp-2" style={{ fontFamily: 'Inter, sans-serif' }}>
          {weatherDesc}
        </p>

        {/* Additional info */}
        <div className="w-full pt-3 border-t border-gray-200 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>Humidity:</span>
            <span className="font-semibold text-gray-800" style={{ fontFamily: 'Poppins, sans-serif' }}>{humidity}%</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>Wind:</span>
            <span className="font-semibold text-gray-800" style={{ fontFamily: 'Poppins, sans-serif' }}>{windSpeed.toFixed(1)} m/s</span>
          </div>
          {rainProbability > 0 && (
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>Rain:</span>
              <span className="font-semibold text-blue-600" style={{ fontFamily: 'Poppins, sans-serif' }}>{Math.round(rainProbability * 100)}%</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
