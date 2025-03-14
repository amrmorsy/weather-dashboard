import { useEffect, useState } from "react";
import { useWeather } from "../hooks/useWeather";
import { useGeolocation } from "../hooks/useGeolocation";
import SearchBar from "../components/SearchBar";
import ForecastChart from "../components/ForecastChart";
import GeolocationButton from "../components/GeolocationButton";
import ThemeToggle from "../components/ThemeToggle";
import WeatherIcon from '../components/WeatherIcon';
import { Analytics } from '@vercel/analytics/react';


const Home = () => {
  const [city, setCity] = useState<string | undefined>(undefined);
  const [localTime, setLocalTime] = useState<string>("");
  const geolocation = useGeolocation();
  const { forecast, currentWeather, loading, locationName, country, timezone } = useWeather(city, geolocation ?? undefined);

  useEffect(() => {

    if (timezone && currentWeather?.dt) {

      const d = new Date(currentWeather.dt * 1000)
      const lt = d.getTime()
      const localOffset = d.getTimezoneOffset() * 60000
      const utc = lt + localOffset
      const currentCityTime = new Date(utc + (1000 * timezone))

      setLocalTime(currentCityTime.toLocaleString(navigator.language, {
        dateStyle: "short",
        timeStyle: "short"
      }));
    }

  }, [timezone, currentWeather])

  return (
    <div className="container">
      <h1>🌤 Weather Forecast</h1>
      <ThemeToggle />
      <div className="search-container">
        <SearchBar onSearch={setCity} />
        <GeolocationButton onLocate={() => setCity(undefined)} />
      </div>

      {/* Show Current Weather Data */}
      {currentWeather && (
        <div className="current-weather">
          <h2>{locationName}, {country}</h2>
          {localTime && (
            <p>{localTime}</p>
          )}
          <p>{currentWeather.weather[0].description}</p>
          <div className="weather-info">
            {/* <img 
              src={`https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`} 
              alt={currentWeather.weather[0].description}
            /> */}
            <WeatherIcon iconCode={currentWeather.weather[0].icon} description={currentWeather.weather[0].description} />
            <div>
              <div className="current-temp">{Math.round(currentWeather.main.temp)}°F</div>
              <p>L: {Math.round(currentWeather.main.temp_min)}° H:{Math.round(currentWeather.main.temp_max)}°</p>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        forecast && (
          <div className="chart-container-wrapper">
            <ForecastChart forecast={forecast} />
          </div>
        )
      )}
      <Analytics />
    </div>
  );
};

export default Home;