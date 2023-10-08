import axios from "axios";

const baseUrl = "https://studies.cs.helsinki.fi/restcountries/api";

const getAll = () =>
  axios.get(`${baseUrl}/all`).then((response) => response.data);

export default {
  getAll,
};
