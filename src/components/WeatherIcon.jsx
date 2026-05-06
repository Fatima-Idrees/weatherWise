import {
  Sun,
  CloudSun,
  CloudRain,
  CloudSnow,
  CloudFog,
  CloudLightning,
  Cloud,
  Moon,
  CloudMoon,
} from 'lucide-react';

const WeatherIcon = ({ condition, size = 48, isDay = true }) => {
  const getIcon = () => {
    const conditionLower = condition?.toLowerCase() || '';

    if (conditionLower.includes('clear')) {
      return isDay ? Sun : Moon;
    }
    if (conditionLower.includes('clouds')) {
      if (conditionLower.includes('few') || conditionLower.includes('scattered')) {
        return isDay ? CloudSun : CloudMoon;
      }
      return Cloud;
    }
    if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
      return CloudRain;
    }
    if (conditionLower.includes('snow')) {
      return CloudSnow;
    }
    if (conditionLower.includes('thunderstorm')) {
      return CloudLightning;
    }
    if (conditionLower.includes('fog') || conditionLower.includes('mist') || conditionLower.includes('haze')) {
      return CloudFog;
    }
    return CloudSun;
  };

  const IconComponent = getIcon();
  return <IconComponent size={size} strokeWidth={1.5} />;
};

export default WeatherIcon;