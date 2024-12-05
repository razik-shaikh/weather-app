
import React, { useEffect } from 'react';
import { useState } from 'react';
import './WeatherCard.css'
// WeatherCard component receives weather data as a prop
function WeatherCard() {

  // State for the city input
  const [city, setCity] = useState("Mumbai");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("")
  const [currentTime, setTime] = useState('')
  const API_KEY = import.meta.env.VITE_API_KEY;

  // Map weather conditions to custom images
  const weatherImages = {
    Clear: "/images/sun.png",
    Clouds: "/images/clouds.png",
    Rain: "/images/rain.png",
    Snow: "/images/snow.png",
    Drizzle: "/images/drizzle.png",
    Thunderstorm: "/images/storm.png",
    Mist: "/images/drizzle.png",
    Haze: "/images/haze.png",
    Fog: "/images/fog.png",
    Smoke: "/images/fog.png",
    Default: "/images/default.png"
  };

  // Determine the appropriate image for the weather
  const weatherCondition = weatherData?.weather[0].main || "Default";
  const weatherImage = weatherImages[weatherCondition] || "/images/default.png";


  // Function to fetch weather data
  async function fetchWeather() {
    setLoading(true);
    try {
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
      const response = await fetch(apiUrl); // Make the API call
      if (!response.ok) {
        throw new Error("city not found");
      }
      const data = await response.json()
      console.log(data)
      setWeatherData(data)
      setError(null); // Clear any previous errors
    } catch (err) {
      setError('Error fetching weather data');//handle any error
      setWeatherData(null); // Clear data on error
    } finally {
      setLoading(false);
    }
  }

  //function to handle input change
  function handleInputChange(event) {
    setCity(event.target.value);
  }

  // Fetch weather when the city changes
  // fetchWeather();
  useEffect(() => {
    fetchWeather(); // Fetch weather data for the default city (Mumbai)
    //for time
    const interval = setInterval(() => {
      const nowTime = new Date();
      setTime(nowTime.toLocaleTimeString());
    }, 1000);

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []); // This ensures the weather data is fetched when the component mounts


  //for date
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-700 font-sans p-2">
      <div className=" flex flex-col  rounded-lg p-6 w-full max-w-xl shadow-lg  bg-cover bg-no-repeat bg-opacity-10 bg-center text-white "
        style={{
          backgroundImage: "url('/images/dark1.jpg')",
          // height: "100vh",
          // width: "100%",
        }}
      >

        {/* Top-left corner of the card */}
        <div className="  flex flex-col items-start">
          {/* SVG Image */}
          <img
            src="/images/sun_icon.svg" // Replace with your SVG path
            alt="Location Icon"
            className=""
          />
          {/* Current Time */}
          <p className="text-xs">{currentDate}</p>
        </div>

        {weatherData && (

          <>
            {/* City Name and Date */}
            < div className="font-bold  text-center font-sans mb-2">
              <h1 className='text-4xl sm:text-4xl lg:text-5xl'>{weatherData.name}</h1>
            </div>
          </>
        )}
        {/* date*/}
        <div className="text-lg text-white text-center">
          {currentTime}
        </div>
        {loading && <p className="text-center text-gray-500">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {/* Weather Icon */}
        <div className="mt-3 text-6xl self-center inline-flex items-center justify-center rounded-lg text-indigo-400 h-24 w-24">
          {/* Custom Weather Image */}
          <img
            src={weatherImage}
            alt={weatherCondition}
            loading="lazy"
            className="w-28 h-25"
          />
        </div>
        {weatherData && (
          <>
            {/* weather description */}
            <div className="flex flex-col text-center items-center ">
              <div>{weatherData.weather[0].description}</div>
            </div>

            {/* Temperature */}
            <div className="flex flex-row items-center justify-center mt-2">
              <div className="font-medium text-4xl sm:text-5xl lg:text-6xl "><h1 className='temp'>{weatherData.main.temp}°C</h1></div>
            </div>

            {/* Wind, Humidity, and Visibility Section */}
            <div className="flex flex-row justify-between mt-6  sm:grid-cols-3 gap-1">
              <div className="flex flex-col items-center bg-slate-600 bg-opacity-30 p-2 rounded-xl w-1/5">
                <div className="font-medium text-sm">Wind Speed</div>
                <div className="text-sm text-white">{weatherData.wind.speed} m/s</div>
              </div>
              <div className="flex flex-col items-center bg-slate-600 bg-opacity-30 p-2 rounded-xl w-1/5">
                <div className="font-medium text-sm">Humidity</div>
                <div className="text-sm text-white">{weatherData.main.humidity}%</div>
              </div>
              <div className="flex flex-col items-center bg-slate-600 bg-opacity-30 p-2 rounded-xl w-1/5">
                <div className="font-medium text-sm">Visibility</div>
                <div className="text-sm text-white">{weatherData.visibility / 1000} km</div>
              </div>
            </div>
          </>
        )}


        {/* Search Bar and Button at the Bottom */}
        <div className="flex flex-col items-center mt-4">
          <input
            type="text"
            value={city}
            onChange={handleInputChange}
            placeholder="Enter city"
            onFocus={(e) => {
              e.target.scrollIntoView({ behavior: "smooth", block: "center" });
            }}
            className="p-2  rounded-xl mb-2 w-full text-black bg-white bg-opacity-70"
          />
          <button className="bg-indigo-500 text-white p-2 rounded-xl w-full bg-opacity-80"
            onClick={fetchWeather}>
            Search
          </button>
        </div>
      </div>
    </div >

  );
}

export default WeatherCard;
