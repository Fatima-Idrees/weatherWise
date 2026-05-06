import { Clock } from 'lucide-react';

const RecentCities = ({ cities, onSelect, onClear }) => {
  if (!cities || cities.length === 0) return null;

  return (
    <div className="recent-section">
      <div className="recent-header">
        <Clock size={16} />
        <span>Recently Searched</span>
        <button onClick={onClear} className="clear-btn">Clear</button>
      </div>
      <div className="recent-chips">
        {cities.map((city, idx) => (
          <button
            key={`${city}-${idx}`}
            onClick={() => onSelect(city)}
            className="recent-chip"
          >
            {city}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RecentCities;