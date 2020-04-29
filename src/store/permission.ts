import { observable } from "mobx";
import { getPermissions } from '../api/permission';

export const Permission = {
  permissions : observable.box([]),
  async getPermissions() {
    const result = await getPermissions();
    const { permissions } = result.data;
    Permission.permissions.set(permissions);
  }
};
