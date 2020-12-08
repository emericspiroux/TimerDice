import axios from 'axios';

export const SUCCESS_SUFFIX = '_SUCCESS';
export const ERROR_SUFFIX = '_FAIL';

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
    /* eslint-disable-next-line no-console */
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
