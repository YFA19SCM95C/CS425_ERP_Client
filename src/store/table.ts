import { observable } from "mobx";
import { getUserList, deleteUserById, updateUsername, getProductList, getInventoryList, getEmployeeList, getCustomerList, getOrderList, getAccessList } from '../api/table';

export const Table = {
  // Table loading
  loading: observable.box(false),
  setLoading(isLoading) {
    Table.loading.set(isLoading);
  },

  // Table pagination current page
  currentPage: observable.box(1),
  setCurrentPage(current) {
    Table.currentPage.set(current);
  },

  productList: observable.box([]),
  inventoryList: observable.box([]),
  employeeList: observable.box([]),
  customerList: observable.box([]),
  orderList: observable.box([]),
  accessList: observable.box([]),

  // Table
  tableData: observable.box([]),
  setTableData(values) {
    Table.tableData.set(values);
  },
  async refreshUserList() {
    Table.setLoading(true);
    try {
      const response = await getUserList();
      const tableData = response.data.tableData;
      Table.setTableData(tableData);
      Table.setCurrentPage(1);
    } catch {
    } finally {
      Table.setLoading(false);
    }
  },
  async deleteUserById(id) {
    await deleteUserById({id});
    Table.refreshUserList();
  },
  async updateUsername(id, username) {
    return updateUsername({
      id: id,
      name: username
    });
  },
  async refreshProductList() {
    Table.setLoading(true);
    try {
      const response = await getProductList();
      const list = response.data.list;
      Table.productList.set(list);
      Table.setCurrentPage(1);
    } catch {
    } finally {
      Table.setLoading(false);
    }
  },
  setProductList(list) {
    Table.productList.set(list);
  },
  async refreshInventoryList() {
    Table.setLoading(true);
    try {
      const response = await getInventoryList();
      const list = response.data.list;
      Table.inventoryList.set(list);
      Table.setCurrentPage(1);
    } catch {
    } finally {
      Table.setLoading(false);
    }
  },
  async refreshEmployeeList() {
    Table.setLoading(true);
    try {
      const response = await getEmployeeList();
      const list = response.data.list;
      Table.inventoryList.set(list);
      Table.setCurrentPage(1);
    } catch {
    } finally {
      Table.setLoading(false);
    }
  },
  async refreshCustomerList() {
    Table.setLoading(true);
    try {
      const response = await getCustomerList();
      const list = response.data.list;
      Table.customerList.set(list);
      Table.setCurrentPage(1);
    } catch {
    } finally {
      Table.setLoading(false);
    }
  },
  async refreshOrderList() {
    Table.setLoading(true);
    try {
      const response = await getOrderList();
      const list = response.data.list;
      Table.orderList.set(list);
      Table.setCurrentPage(1);
    } catch {
    } finally {
      Table.setLoading(false);
    }
  },
  async refreshAccessList() {
    Table.setLoading(true);
    try {
      const response = await getAccessList();
      const list = response.data.list;
      Table.accessList.set(list);
      Table.setCurrentPage(1);
    } catch {
    } finally {
      Table.setLoading(false);
    }
  },
};
