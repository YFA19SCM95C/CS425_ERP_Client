import { get, post } from './request';

export const getLoginStatus = async () => {
  return get('/api/loginStatus'); 
}

export const doLogin = async (params: { username: string; password: string }) => {
  return post('/api/doLogin', params); 
}

export const doLogout = async () => {
  return post('/api/doLogout'); 
}
