import axios from "axios";
const baseUrl = "/api/persons";

const getAll = () => {
  return axios.get(baseUrl).then((response) => response.data);
};

const create = (newObject) => axios.post(baseUrl, newObject);

const remove = (id) => axios.delete(`${baseUrl}/${id}`);

const update = (id, newObject) => {
  return axios
    .put(`${baseUrl}/${id}`, newObject)
    .then((response) => response.data);
};

export default {
  getAll,
  create,
  remove,
  update,
};
