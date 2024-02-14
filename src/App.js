import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const targetDate = new Date('2024-05-04T05:00:00');
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

    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      return {
        days,
        hours: hours < 10 ? `0${hours}` : hours,
        minutes: minutes < 10 ? `0${minutes}` : minutes,
        seconds: seconds < 10 ? `0${seconds}` : seconds,
      };
    } else {
      return {
        days: 0,
        hours: '00',
        minutes: '00',
        seconds: '00',
      };
    }
  }

  return (
    <div className="app-container">
       <video autoPlay loop muted className="background-video">
        <source src="latimelapse/latimelapse.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="center-content">
        <h1>GoToLA</h1>
        <div>
          <p>{`${timeLeft.days} nap ${timeLeft.hours}:${timeLeft.minutes}:${timeLeft.seconds}`}</p>
          {weather && (
            <p>{` ${weather.main.temp} °C, ${weather.weather[0].description}`}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
