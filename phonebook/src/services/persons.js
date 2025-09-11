import axios from "axios";

const url = "/api/persons";

const getAll = () => 
  axios
    .get(url)
    .then(response => response.data);

const create = (newPerson) => 
  axios
    .post(url, newPerson)
    .then(response => response.data)

const remove = (id) => 
  axios
    .delete(`${url}/${id}`)
    .then(response => response.data)

const update = (id, newPerson) => 
  axios
    .put(`${url}/${id}`, newPerson)
    .then(response => response.data)

const find = (query) => 
  axios
    .get(`${url}?name=${query}`)
    .then(response => response.data)


export default { getAll, create, remove, update, find}