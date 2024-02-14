// App.js
import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const targetDate = useMemo(() => new Date('2024-05-04T05:00:00'), []);
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetDate));
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [targetDate]);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await axios.get(
          'https://api.openweathermap.org/data/2.5/weather',
          {
            params: {
              q: 'Los Angeles',
              appid: '496672d3170faffb195fed94d475ee44',
              units: 'metric', // Celsius
            },
          }
        );
        setWeather(response.data);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    fetchWeather();
  }, []);

  function calculateTimeLeft(targetDate) {
    const now = new Date();
    const difference = targetDate - now;

    if (difference < 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  }

  return (
    <div className="app-container">
      <video controls loop className="background-video">
        <source src={`${process.env.PUBLIC_URL}/latimelapse/latimelapse.mp4`} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="blur-background"></div>
      <div className="center-content">
        <div className="blur-box">
          <h1>GoToLA</h1>
          <div>
            <p>{`${timeLeft.days} nap ${timeLeft.hours}:${timeLeft.minutes}:${timeLeft.seconds}`}</p>
            {weather && (
              <div>
                <p>
                  Los Angeles<br /> {weather.main.temp} °C<br />
                  {` ${new Date(weather.dt * 1000).toLocaleTimeString()}`}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
