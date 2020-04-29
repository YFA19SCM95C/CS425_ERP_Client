import { get } from './request';

export const getPermissions = async () => {
  return get('/api/permissions'); 
}
