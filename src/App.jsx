import { useState, useEffect, useCallback, useRef } from 'react';
import './App.css';
import { getWeatherByCity, getForecastByCity, getWeatherByCoords, getForecastByCoords } from './api/weatherService';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import ForecastList from './components/ForecastList';
import RecentCities from './components/RecentCities';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [units, setUnits] = useState('celsius');
  const [recentCities, setRecentCities] = useState(() => {
    const saved = localStorage.getItem('recentCities');
    return saved ? JSON.parse(saved) : [];
  });
  const [lastUpdated, setLastUpdated] = useState(null);
  const [currentCity, setCurrentCity] = useState(null);
  const isLoadingRef = useRef(false);

  const saveRecentCity = (city) => {
    if (!city) return;
    const updated = [city, ...recentCities.filter(c => c.toLowerCase() !== city.toLowerCase())].slice(0, 5);
    setRecentCities(updated);
    localStorage.setItem('recentCities', JSON.stringify(updated));
  };

  const fetchWeather = useCallback(async (city) => {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;
    setLoading(true);
    setError(null);
    
    try {
      const [weather, forecast] = await Promise.all([
        getWeatherByCity(city),
        getForecastByCity(city)
      ]);
      setWeatherData(weather);
      setForecastData(forecast.list);
      setCurrentCity(city);
      setLastUpdated(new Date().toLocaleTimeString());
      saveRecentCity(city);
    } catch (err) {
      setError(err.message);
      setWeatherData(null);
      setForecastData(null);
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, [recentCities]);

  const fetchWeatherByCoords = useCallback(async (lat, lon) => {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;
    setLoading(true);
    setError(null);
    
    try {
      const [weather, forecast] = await Promise.all([
        getWeatherByCoords(lat, lon),
        getForecastByCoords(lat, lon)
      ]);
      setWeatherData(weather);
      setForecastData(forecast.list);
      setCurrentCity(weather.name);
      setLastUpdated(new Date().toLocaleTimeString());
      saveRecentCity(weather.name);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, []);

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
      },
      () => {
        setError('Unable to retrieve your location. Please check permissions.');
      }
    );
  };

  const handleRefresh = () => {
    if (currentCity) {
      fetchWeather(currentCity);
    } else if (weatherData?.name) {
      fetchWeather(weatherData.name);
    }
  };

  const handleUnitToggle = () => {
    setUnits(prev => prev === 'celsius' ? 'fahrenheit' : 'celsius');
  };

  // Dynamic background based on weather condition and time
  const getBackgroundClass = () => {
    if (!weatherData) return 'bg-default';
    
    const condition = weatherData.weather[0]?.main?.toLowerCase() || '';
    const now = Math.floor(Date.now() / 1000);
    const isDay = weatherData.sys && now > weatherData.sys.sunrise && now < weatherData.sys.sunset;
    
    if (condition.includes('clear')) return isDay ? 'bg-clear-day' : 'bg-clear-night';
    if (condition.includes('cloud')) return isDay ? 'bg-clouds-day' : 'bg-clouds-night';
    if (condition.includes('rain')) return 'bg-rain';
    if (condition.includes('snow')) return 'bg-snow';
    if (condition.includes('thunder')) return 'bg-thunder';
    if (condition.includes('fog') || condition.includes('mist')) return 'bg-fog';
    return 'bg-default';
  };

  useEffect(() => {
    // Load default city on mount
    if (recentCities.length > 0) {
      fetchWeather(recentCities[0]);
    } else {
      fetchWeather('London');
    }
  }, []);

  return (
    <div className={`app ${getBackgroundClass()}`}>
      <div className="container">
        <header className="app-header">
          <h1>Weather<span>Wise</span></h1>
          <p className="tagline">Your personal weather companion</p>
        </header>

        <SearchBar 
          onSearch={fetchWeather}
          onUseMyLocation={handleUseMyLocation}
          onRefresh={handleRefresh}
          isLoading={loading}
        />

        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        {loading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Fetching weather data...</p>
          </div>
        )}

        {!loading && weatherData && (
          <>
            <CurrentWeather 
              data={weatherData}
              units={units}
              onUnitToggle={handleUnitToggle}
              lastUpdated={lastUpdated}
            />
            <ForecastList forecast={forecastData} units={units} />
            <RecentCities 
              cities={recentCities}
              onSelect={fetchWeather}
              onClear={() => {
                setRecentCities([]);
                localStorage.removeItem('recentCities');
              }}
            />
          </>
        )}

        <footer className="app-footer">
          <p>Weather data by <a href="https://openweathermap.org/" target="_blank" rel="noopener noreferrer">OpenWeatherMap</a></p>
        </footer>
      </div>
    </div>
  );
}

export default App;