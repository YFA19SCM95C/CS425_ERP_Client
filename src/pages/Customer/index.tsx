import React, {useState} from "react";
import { Table, Popconfirm } from 'antd';
import { useObserver } from 'mobx-react-lite';
import { storeContext } from '../../components/context';
import { EditableRow, EditableCell } from './components/EditableItem';
import { AddCustomer } from './components/AddCustomer';
import * as style from './index.scss';
import { timeElapse } from '../../utils';
import { Filter } from '../../components/Filter';
import { getFields } from '../App/components/FilterField';
import { PermissionChecker } from '../../components/PermissionChecker';
import { permissions } from '../../constants';
import { getCustomerList } from '../../api/table';

const { addUser, updateUser, deleteUser } = permissions;
const pagination = {
  defaultPageSize: 5,
  defaultCurrent: 1
};

interface TableDataItem {
  id: string;
  name: string;
  job: string;
  date: number;
}

export const Customer = () => {
  const store = React.useContext(storeContext);
  if (!store) throw Error("Store shouldn't be null");
  const { tableData, setTableData, deleteUserById, updateUsername, refreshUserList, loading, setLoading, currentPage, setCurrentPage, refreshCustomerList, customerList } = store.tableStore;
  const { permissions } = store.permissionStore;
  const [employeeList, setEmployeeList] = useState([]);

  const handleSave = (row) => {
    const newData: TableDataItem[] = [...tableData.get()];
    const index = newData.findIndex(item => row.id === item.id);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setTableData(newData);
    setLoading(true);
    updateUsername(row.id, row.name).then(() => {
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  };

  const handleDelete = (key) => {
    deleteUserById(key);
  };

  const newTableData = () => {
    const data = tableData.get().map((item: { date: string }) => {
      const date = new Date(item.date);
      const now = new Date();
      return {
        ...item,
        duration: timeElapse(date, now)
      };
    });
    return data;
  }

  const onPageNumberChange = (page) => {
    setCurrentPage(page);
  }

  const onShowSizeChange = () => {
    setCurrentPage(1);
  }

  React.useEffect(() => {
    refreshCustomerList();
  }, []);

  return useObserver(() => {
    const permissionsSet: Set<number> = new Set(permissions.get());
    const components = {
      body: {
        row: EditableRow,
        cell: EditableCell,
      },
    };


    React.useEffect(() => {
      // refreshUserList();
      getCustomerList().then((result) => {
        setEmployeeList(result.data.list);
      });
    }, []);

    const columns = [
      {
        title: 'First Name',
        dataIndex: 'fistName',
        key: 'firstName',
        editable: permissionsSet.has(updateUser)
      },
      {
        title: 'Last Name',
        dataIndex: 'lastName',
        key: 'lastName',
      },
      {
        title: 'Phone Number',
        dataIndex: 'phoneNumber',
        key: 'phoneNumber',
      },
      {
        title: 'EmployeeID',
        dataIndex: 'employeeID',
        key: 'employeeID',
      },
    ];

    const deleUserCol = {
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
        render: (text, record) =>
          tableData.get().length >= 1 ? (
            <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.id)}>
              <a>Delete</a>
            </Popconfirm>
          ) : null,
      };

    if (permissionsSet.has(deleteUser)) {
      columns.push(deleUserCol);
    }

    const columnsWrap = columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: handleSave,
        }),
      };
    });


    const current = currentPage.get();

    return (
      <div style={{padding: 24}}>
        {/**
        <Filter>{getFields()}</Filter>
        */}
        <PermissionChecker permission={'4'}>
          <AddCustomer />
        </PermissionChecker>
        <Table
          rowKey='customerID'
          className={style['table']}
          components={components}
          rowClassName={() => 'editable-row'}
          columns={columnsWrap}
          dataSource={customerList.get()}
          loading={loading.get()}
          pagination={{
            ...pagination,
            current: current,
            onChange: onPageNumberChange,
            onShowSizeChange: onShowSizeChange,
            total: tableData.get().length,
            pageSizeOptions: ['5', '10', '20'],
            showSizeChanger: true,
            showQuickJumper: true
          }}
        />
      </div>
        )
  });
};
