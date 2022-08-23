import axios from "axios";

const API = axios.create({
  baseURL: "https://pronomaker.herokuapp.com/",
});

export default API;
