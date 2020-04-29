import { Table } from './table';
import { Login } from './login';
import { Permission } from './permission';
import { App } from './app';

export const createStore = () => {
  const store = {
    tableStore: Table,
    loginStore: Login,
    appStore: App,
    permissionStore: Permission
  };

  return store;
};

export type TStore = ReturnType<typeof createStore>;
