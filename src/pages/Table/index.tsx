import React, {useState} from "react";
import { Table, Popconfirm } from 'antd';
import { useObserver } from 'mobx-react-lite';
import { storeContext } from '../../components/context';
import { EditableRow, EditableCell } from './components/EditableItem';
import { AddEmployee } from './components/AddEmployee';
import * as style from './index.scss';
import { timeElapse } from '../../utils';
import { Filter } from '../../components/Filter';
import { getFields } from '../App/components/FilterField';
import { PermissionChecker } from '../../components/PermissionChecker';
import { permissions } from '../../constants';
import { getEmployeeList } from '../../api/table';

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

export const FilterTable = () => {
  const store = React.useContext(storeContext);
  if (!store) throw Error("Store shouldn't be null");
  const { tableData, setTableData, deleteUserById, updateUsername, refreshUserList, loading, setLoading, currentPage, setCurrentPage } = store.tableStore;
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

  return useObserver(() => {
    const permissionsSet: Set<number|string> = new Set(permissions.get());
    const components = {
      body: {
        row: EditableRow,
        cell: EditableCell,
      },
    };


    React.useEffect(() => {
      // refreshUserList();
      getEmployeeList().then((result) => {
        setEmployeeList(result.data.list);
      });
    }, []);

    const columns = [
      {
        title: 'First Name',
        dataIndex: 'firstName',
        key: 'firstName',
        editable: permissionsSet.has(updateUser)
      },
      {
        title: 'Last Name',
        dataIndex: 'lastName',
        key: 'lastName',
      },
      {
        title: 'Type',
        dataIndex: 'type',
        key: 'type',
      },
    ];

    const limitedColumns = [
      {
        title: 'Salary',
        dataIndex: 'salary',
        key: 'salary',
      },
      {
        title: 'EmployeeID',
        dataIndex: 'employeeID',
        key: 'employeeID',
      },
      {
        title: 'SSN',
        dataIndex: 'ssn',
        key: 'ssn',
      },
      {
        title: 'City',
        dataIndex: 'city',
        key: 'city',
      },
      {
        title: 'State',
        dataIndex: 'state',
        key: 'state',
      },
      {
        title: 'Street Name',
        dataIndex: 'streetName',
        key: 'streetName',
      },
      {
        title: 'Street Number',
        dataIndex: 'streetNumber',
        key: 'streetNumber',
      },
      {
        title: 'Zip',
        dataIndex: 'zip',
        key: 'zip',
      },
    ];

    if (!permissionsSet.has("10")) {
      columns.push(...limitedColumns);
    }

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
        <PermissionChecker permission={'9'}>
          <AddEmployee />
        </PermissionChecker>
        <Table
          rowKey='employeeID'
          className={style['table']}
          components={components}
          rowClassName={() => 'editable-row'}
          columns={columnsWrap}
          dataSource={employeeList}
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
