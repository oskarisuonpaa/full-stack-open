import { useState, useEffect } from "react";

import countryService from "./services/countries";
import weatherService from "./services/weather";

const Countries = ({ countries, setFilter }) => {
  if (countries.length > 10)
    return <p>Too many matches, specify another filter.</p>;
  else if (countries.length === 1) return <Country country={countries[0]} />;
  else
    return countries.map((country) => (
      <p key={country.name.common}>
        {country.name.common}{" "}
        <button onClick={() => setFilter(country.name.common)}>show</button>
      </p>
    ));
};

const Country = ({ country }) => {
  return (
    <>
      <h1>{country.name.common}</h1>
      {country.capital.map((capital) => (
        <p key={capital}>capital {capital}</p>
      ))}
      <p>area {country.area}</p>

      <h3>languages:</h3>

      <ul>
        {Object.values(country.languages).map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>

      <img src={country.flags.png} alt={country.flags.alt} />

      <Weather country={country} />
    </>
  );
};

const Weather = ({ country }) => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    weatherService
      .getWeather(country.latlng[0], country.latlng[1])
      .then((data) => setWeather(data));
  }, []);

  if (!weather) return;

  return (
    <>
      <h2>Weather in {country.name.common}</h2>
      <p>temperature {weather.main.temp} Celcius</p>
      <img
        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
        alt="Weather icon"
      />
      <p>wind {weather.wind.speed} m/s</p>
    </>
  );
};

const App = () => {
  const [countries, setCountries] = useState(null);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    countryService.getAll().then((data) => setCountries(data));
  }, []);

  if (!countries) return;

  const countriesToShow = filter
    ? countries.filter((country) =>
        country.name.common.toLowerCase().includes(filter.toLowerCase())
      )
    : countries;

  return (
    <>
      find countries{" "}
      <input
        value={filter}
        onChange={(event) => setFilter(event.target.value)}
      />
      <Countries countries={countriesToShow} setFilter={setFilter} />
    </>
  );
};

export default App;
