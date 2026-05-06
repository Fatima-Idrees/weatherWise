import ForecastCard from './ForecastCard';

const ForecastList = ({ forecast, units }) => {
  if (!forecast || forecast.length === 0) return null;

  // Group forecast by day and get daily min/max
  const dailyForecasts = {};
  forecast.forEach((item) => {
    const date = item.dt_txt.split(' ')[0];
    if (!dailyForecasts[date]) {
      dailyForecasts[date] = {
        date,
        temp_min: item.main.temp_min,
        temp_max: item.main.temp_max,
        condition: item.weather[0].main,
        weatherDesc: item.weather[0].description,
      };
    } else {
      dailyForecasts[date].temp_min = Math.min(dailyForecasts[date].temp_min, item.main.temp_min);
      dailyForecasts[date].temp_max = Math.max(dailyForecasts[date].temp_max, item.main.temp_max);
    }
  });

  // Convert to array and take first 5 days (excluding today if it's partial)
  let dailyList = Object.values(dailyForecasts);
  if (dailyList.length > 5) dailyList = dailyList.slice(0, 5);

  return (
    <div className="forecast-section">
      <h3>5-Day Forecast</h3>
      <div className="forecast-scroll">
        {dailyList.map((day, idx) => (
          <ForecastCard key={idx} forecast={day} units={units} />
        ))}
      </div>
    </div>
  );
};

export default ForecastList;