import { Oval } from 'react-loader-spinner';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFrown } from '@fortawesome/free-solid-svg-icons';
import './App.css';

function WeatherApp() {
  const [input, setInput] = useState('Vijayawada'); // Set default city as Vijayawada
  const [weather, setWeather] = useState({
    loading: false,
    data: {},
    error: false,
  });

  const toDateFunction = () => {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const WeekDays = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const currentDate = new Date();
    const date = `${WeekDays[currentDate.getDay()]} ${currentDate.getDate()} ${months[currentDate.getMonth()]
      }`;
    return date;
  };

  const search = async (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      setWeather({ ...weather, loading: true });
      const url = 'https://api.openweathermap.org/data/2.5/weather';
      const api_key = 'f00c38e0279b7bc85480c3fe775d518c';

      await axios
        .get(url, {
          params: {
            q: input,
            units: 'metric',
            appid: api_key,
          },
        })
        .then((res) => {
          setWeather({ data: res.data, loading: false, error: false });
        })
        .catch((error) => {
          setWeather({ ...weather, data: {}, error: true });
          setInput('');
          console.log('error', error);
        });
    }
  };

  // Fetch weather for Vijayawada on initial load
  useEffect(() => {
    setWeather({ ...weather, loading: true });
    const url = 'https://api.openweathermap.org/data/2.5/weather';
    const api_key = 'f00c38e0279b7bc85480c3fe775d518c';

    axios
      .get(url, {
        params: {
          q: 'Vijayawada',
          units: 'metric',
          appid: api_key,
        },
      })
      .then((res) => {
        setWeather({ data: res.data, loading: false, error: false });
      })
      .catch((error) => {
        setWeather({ ...weather, data: {}, error: true });
        console.log('error', error);
      });
  }, []);

  return (
    <div className="App">
      <div className="main-content">
        <header className="header">
          <h1 className="app-name">Weather App</h1>
        </header>

        <div className="search-container">
          <input
            type="text"
            className="city-search"
            placeholder="Enter City Name..."
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyPress={search}
          />
        </div>

        <div className="weather-info-container">
          {weather.loading && (
            <div className="loading-indicator">
              <Oval type="Oval" color="black" height={100} width={100} />
            </div>
          )}

          {weather.error && (
            <div className="error-message">
              <FontAwesomeIcon icon={faFrown} />
              <span>City not found</span>
            </div>
          )}

          {weather.data.main && !weather.loading && !weather.error && (
            <div className="weather-data">
              <div className="location">
                <h2>
                  {weather.data.name}, <span>{weather.data.sys.country}</span>
                </h2>
                <p className="date">{toDateFunction()}</p>
              </div>

              <div className="temperature">
                <img
                  src={`https://openweathermap.org/img/wn/${weather.data.weather[0].icon}@2x.png`}
                  alt={weather.data.weather[0].description}
                />
                <div className="temp-value">
                  <span>{Math.round(weather.data.main.temp)}</span>
                  <sup>°C</sup>
                </div>
              </div>

              <div className="weather-description">
                <p>{weather.data.weather[0].description.toUpperCase()}</p>
                <p>Wind Speed: {weather.data.wind.speed} m/s</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default WeatherApp;
