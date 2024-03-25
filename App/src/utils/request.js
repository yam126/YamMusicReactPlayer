import axios from 'axios';
const service = axios.create({
  baseURL: 'http://192.168.3.82:5242/',
  headers: {
    'Content-Type': 'application/json',
  },
});
service.defaults.headers.common['Content-Type'] = 'application/json';
// 请求拦截器
service.interceptors.request.use(
  config => {
    config.headers.setContentType('application/json', true);
    console.log('config', config);
    return config;
  },
  error => {
    console.log('error', error);
    return error;
  },
);
// 响应拦截器
service.interceptors.response.use(
  response => {
    console.log('response', response);
    return response;
  },
  error => {
    console.log('error', error);
    return error;
  },
);
export default service;
