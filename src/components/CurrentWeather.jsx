import { Droplets, Wind, Eye, Gauge, Sunrise, Sunset, Thermometer, Compass } from 'lucide-react';
import WeatherIcon from './WeatherIcon';

const CurrentWeather = ({ data, units, onUnitToggle, lastUpdated }) => {
  if (!data) return null;

  const convertTemp = (temp) => {
    if (units === 'fahrenheit') {
      return ((temp * 9) / 5 + 32).toFixed(1);
    }
    return temp.toFixed(1);
  };

  const getWindDirection = (deg) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return directions[Math.round(deg / 45) % 8];
  };

  const isDay = () => {
    if (!data.sys) return true;
    const now = Math.floor(Date.now() / 1000);
    return now > data.sys.sunrise && now < data.sys.sunset;
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="weather-card current-weather">
      <div className="current-header">
        <div className="location-info">
          <h2>{data.name}, {data.sys?.country}</h2>
          <div className="last-updated">
            Last updated: {lastUpdated}
          </div>
        </div>
        <button onClick={onUnitToggle} className="unit-toggle">
          °{units === 'celsius' ? 'C' : 'F'}
        </button>
      </div>

      <div className="current-main">
        <div className="weather-condition">
          <WeatherIcon 
            condition={data.weather[0]?.description} 
            size={64}
            isDay={isDay()}
          />
          <div className="condition-text">{data.weather[0]?.description}</div>
        </div>
        <div className="temperature-large">
          {convertTemp(data.main.temp)}°{units === 'celsius' ? 'C' : 'F'}
        </div>
      </div>

      <div className="feels-like">
        <Thermometer size={18} />
        Feels like: {convertTemp(data.main.feels_like)}°{units === 'celsius' ? 'C' : 'F'}
      </div>

      <div className="weather-details-grid">
        <div className="detail-card">
          <Droplets size={20} />
          <div className="detail-info">
            <span className="detail-label">Humidity</span>
            <span className="detail-value">{data.main.humidity}%</span>
          </div>
        </div>
        <div className="detail-card">
          <Wind size={20} />
          <div className="detail-info">
            <span className="detail-label">Wind Speed</span>
            <span className="detail-value">
              {units === 'celsius' 
                ? `${(data.wind.speed * 3.6).toFixed(1)} km/h`
                : `${(data.wind.speed * 2.237).toFixed(1)} mph`}
              <Compass size={14} className="wind-dir" />
              {getWindDirection(data.wind.deg)}
            </span>
          </div>
        </div>
        <div className="detail-card">
          <Gauge size={20} />
          <div className="detail-info">
            <span className="detail-label">Pressure</span>
            <span className="detail-value">{data.main.pressure} hPa</span>
          </div>
        </div>
        <div className="detail-card">
          <Eye size={20} />
          <div className="detail-info">
            <span className="detail-label">Visibility</span>
            <span className="detail-value">{(data.visibility / 1000).toFixed(1)} km</span>
          </div>
        </div>
        <div className="detail-card">
          <Sunrise size={20} />
          <div className="detail-info">
            <span className="detail-label">Sunrise</span>
            <span className="detail-value">{formatTime(data.sys?.sunrise)}</span>
          </div>
        </div>
        <div className="detail-card">
          <Sunset size={20} />
          <div className="detail-info">
            <span className="detail-label">Sunset</span>
            <span className="detail-value">{formatTime(data.sys?.sunset)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;