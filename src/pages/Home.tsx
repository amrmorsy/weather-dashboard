import { useState } from "react";
import { useWeather } from "../hooks/useWeather";
import { useGeolocation } from "../hooks/useGeolocation";
import SearchBar from "../components/SearchBar";
import ForecastChart from "../components/ForecastChart";
import GeolocationButton from "../components/GeolocationButton";
import ThemeToggle from "../components/ThemeToggle";

const Home = () => {
  const [city, setCity] = useState<string | undefined>(undefined);
  const geolocation = useGeolocation();
  const { forecast, loading, locationName, countryName } = useWeather(city, geolocation ?? undefined);

  return (
    <div className="container">
      <h1>🌤 Weather Forecast</h1>
      <ThemeToggle />
      <div className="search-container">
        <SearchBar onSearch={setCity} />
        <GeolocationButton onLocate={() => setCity(undefined)} />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        forecast && (
          <>
            <h2>{locationName}{countryName && <span>, {countryName}</span>}</h2> {/* Display the location name */}
            <div className="chart-container-wrapper">
              <ForecastChart forecast={forecast} />
            </div>
          </>
        )
      )}
    </div>
  );
};

export default Home;