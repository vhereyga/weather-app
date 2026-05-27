import { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  onSearch: (city: string) => void;
  isLoading?: boolean;
}

export function SearchBar({ onSearch, isLoading = false }: SearchBarProps) {
  const [searchInput, setSearchInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearch(searchInput.trim());
      setSearchInput('');
    }
  };

  const handleQuickSearch = (city: string) => {
    onSearch(city);
  };

  return (
    <div className="w-full mb-8">
      {/* Search Form */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for a city..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-10 py-2 h-11 border-2 border-gray-200 focus:border-blue-500 focus:ring-0 rounded-lg transition-colors"
              style={{ fontFamily: 'Inter, sans-serif' }}
              disabled={isLoading}
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading || !searchInput.trim()}
            className="px-6 h-11 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-all duration-200"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            {isLoading ? 'Loading...' : 'Search'}
          </Button>
        </div>
      </form>

      {/* Quick search buttons */}
      <div className="flex flex-wrap gap-2">
        <span className="text-sm text-gray-600 self-center" style={{ fontFamily: 'Inter, sans-serif' }}>Quick search:</span>
        {['Jakarta', 'Tokyo', 'New York', 'London', 'Sydney'].map((city) => (
          <Button
            key={city}
            onClick={() => handleQuickSearch(city)}
            disabled={isLoading}
            variant="outline"
            size="sm"
            className="text-xs border-gray-300 hover:bg-blue-50 hover:border-blue-300 transition-colors"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            <MapPin className="w-3 h-3 mr-1" />
            {city}
          </Button>
        ))}
      </div>
    </div>
  );
}
