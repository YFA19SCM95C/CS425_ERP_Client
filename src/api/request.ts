import axios from 'axios';
import './axiosSetting.ts';

const request = async (_options) => {
  const method = _options.method || 'GET';
  const options = Object.assign({},
    { ..._options },
    {
      method,
    }
  )
  return axios(options);
};

export const get = (url, params = {}, _options = {}) => {
  return request({ ..._options, params, url });
};

export const post = (url, data = {}, _options = {}) => {
  return request({ ..._options, data, url, method : 'POST' });
};

export default request;
