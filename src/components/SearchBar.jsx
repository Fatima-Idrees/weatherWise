import { useState } from 'react';
import { Search, MapPin, RefreshCw } from 'lucide-react';

const SearchBar = ({ onSearch, onUseMyLocation, onRefresh, isLoading }) => {
  const [city, setCity] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city.trim());
    }
  };

  return (
    <div className="search-section">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-wrapper">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search for a city..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <button type="submit" disabled={isLoading || !city.trim()}>
          Search
        </button>
      </form>
      <div className="action-buttons">
        <button onClick={onUseMyLocation} disabled={isLoading} className="icon-btn">
          <MapPin size={18} />
          My Location
        </button>
        <button onClick={onRefresh} disabled={isLoading} className="icon-btn">
          <RefreshCw size={18} className={isLoading ? 'spinning' : ''} />
          Refresh
        </button>
      </div>
    </div>
  );
};

export default SearchBar;