import axios from 'axios'
import { message } from 'antd'

axios.defaults.withCredentials = true
axios.defaults.timeout = 10000

const codeMessage = {
  0: 'error',
  1: 'success',
  401: 'not login',
  403: 'no permission'
}

axios.interceptors.request.use(
  config => {
        return config;
    },
  error => {
    // Request error
    console.log(error);
    Promise.reject(error);
  }
)

axios.interceptors.response.use(
    response => {
      const data = response.data;
      if (!data.data || data.data.code !== 1) {
        message.error(codeMessage[data.code] || 'Error');
      } else {
        return data;
      }
    },
    error => {
      console.log(error);
      message.error('Error');
      return Promise.reject(error)
    }
)
