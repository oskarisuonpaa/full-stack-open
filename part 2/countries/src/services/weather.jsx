import axios from "axios";

const API_KEY = import.meta.env.VITE_API_KEY;

const getWeather = (latitude, longitude) =>
  axios
    .get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
    )
    .then((response) => response.data);

export default {
  getWeather,
};
