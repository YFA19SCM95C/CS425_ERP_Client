import { get, post } from './request';

interface GetUserListParam {
  name?: string;
  job?: string;
  date?: number;
}

export const getUserList = async (params: GetUserListParam = {}) => {
  return get('/api/userlist', params); 
}

export const getEmployeeList = async (params: GetUserListParam = {}) => {
  return get('/api/employeelist', params); 
}

export const getCustomerList = async (params: GetUserListParam = {}) => {
  return get('/api/customerlist', params); 
}

export const getProductList = async (params: GetUserListParam = {}) => {
  return get('/api/productlist', params); 
}

export const getInventoryList = async (params: GetUserListParam = {}) => {
  return get('/api/inventorylist', params); 
}

export const getOrderList = async (params: GetUserListParam = {}) => {
  return get('/api/orderlist', params); 
}

export const getAccessList = async (params: GetUserListParam = {}) => {
  return get('/api/accesslist', params); 
}

export const getRoleList = async (params: GetUserListParam = {}) => {
  return get('/api/rolelist', params); 
}

interface UpdateUsernameParam {
  id: number;
  name: string;
}

export const updateUsername = async (params: UpdateUsernameParam) => {
  return post('/api/updateUsername', params);
}

interface AddUserParams {
  name: string;
  job: string;
  date: number;
};

export const addUser = async (params: AddUserParams) => {
  return post('/api/addUser', params);
}

export const addModel = async (params) => {
  return post('/api/addModel', params);
}

export const addInventory = async (params) => {
  return post('/api/addInventory', params);
}

export const addEmployee = async (params) => {
  return post('/api/addEmployee', params);
}

export const addCustomer = async (params) => {
  return post('/api/addCustomer', params);
}

export const createOrder = async (params) => {
  return post('/api/createOrder', params);
}

export const grantAccess = async (params) => {
  return post('/api/grantAccess', params);
}

export const createView = async (params) => {
  return post('/api/createView', params);
}

export const deleteUserById = async (params: { id: number }) => {
  return post('/api/deleteUserById', params);
}
