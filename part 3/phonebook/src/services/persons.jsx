import axios from "axios";
const baseUrl = "http://localhost:3001/api/persons";

const getAll = () => axios.get(baseUrl).then((response) => response.data);

const create = (newObject) =>
  axios.post(baseUrl, newObject).then((response) => response.data);

const remove = (id) =>
  axios.delete(`${baseUrl}/${id}`).then((response) => response.data);

const update = (id, updateObject) =>
  axios.put(`${baseUrl}/${id}`, updateObject).then((response) => response.data);

export default {
  getAll,
  create,
  remove,
  update,
};