import React, {useState} from "react";
import { Table, Popconfirm } from 'antd';
import { useObserver } from 'mobx-react-lite';
import { storeContext } from '../../components/context';
import { EditableRow, EditableCell } from './components/EditableItem';
import { CreateOrder } from './components/CreateOrder';
import * as style from './index.scss';
import { timeElapse } from '../../utils';
import { Filter } from '../../components/Filter';
import { getFields } from '../App/components/FilterField';
import { PermissionChecker } from '../../components/PermissionChecker';
import { permissions } from '../../constants';
import { getOrderList } from '../../api/table';

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

export const Order = () => {
  const store = React.useContext(storeContext);
  if (!store) throw Error("Store shouldn't be null");
  const { tableData, setTableData, deleteUserById, updateUsername, refreshUserList, loading, setLoading, currentPage, setCurrentPage, orderList, refreshOrderList } = store.tableStore;
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
    refreshOrderList();
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
      getOrderList().then((result) => {
        setEmployeeList(result.data.list);
      });
    }, []);

    const columns = [
      {
        title: 'OrderID',
        dataIndex: 'orderID',
        key: 'orderID',
        editable: permissionsSet.has(updateUser)
      },
      {
        title: 'Sale Value',
        dataIndex: 'saleValue',
        key: 'saleValue',
      },
      {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
      },
      {
        title: 'CustomerID',
        dataIndex: 'customerID',
        key: 'customerID',
      },
      {
        title: 'EmployeeID',
        dataIndex: 'employeeID',
        key: 'employeeID',
      },
      {
        title: 'AddressID',
        dataIndex: 'addressID',
        key: 'addressID',
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
        <PermissionChecker permission={'5'}>
          <CreateOrder />
        </PermissionChecker>
        <Table
          rowKey='orderID'
          className={style['table']}
          components={components}
          rowClassName={() => 'editable-row'}
          columns={columnsWrap}
          dataSource={orderList.get()}
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
