import WeatherIcon from './WeatherIcon';

const ForecastCard = ({ forecast, units }) => {
  const convertTemp = (temp) => {
    if (units === 'fahrenheit') {
      return ((temp * 9) / 5 + 32).toFixed(0);
    }
    return temp.toFixed(0);
  };

  const getDayName = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  // Determine if it's day based on forecast time (12:00:00 assumed to be day)
  const isDay = true;

  return (
    <div className="forecast-card">
      <div className="forecast-day">{getDayName(forecast.date)}</div>
      <div className="forecast-icon">
        <WeatherIcon 
          condition={forecast.condition} 
          size={40}
          isDay={isDay}
        />
      </div>
      <div className="forecast-temp">
        <span className="temp-high">{convertTemp(forecast.temp_max)}°</span>
        <span className="temp-low">{convertTemp(forecast.temp_min)}°</span>
      </div>
      <div className="forecast-condition">{forecast.condition}</div>
    </div>
  );
};

export default ForecastCard;