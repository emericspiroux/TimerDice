import axios from 'axios';

const HttpMethods = {
  GET: 'GET',
  POST: 'POST',
  DELETE: 'DELETE',
  PUT: 'PUT',
  PATCH: 'PATCH',
};

const axiosDefault = axios.create({
  baseURL: process.env.REACT_APP_BASEURL,
});

const configure = () => {
  axiosDefault.interceptors.response.use(async (response) => {
    if (response.status !== 200) console.error(response.data);
    return response;
  });
};

const getAxiosClients = () => ({
  default: {
    client: axiosDefault,
  },
});

export default {
  HttpMethods,
  configure,
  getAxiosClients,
};
