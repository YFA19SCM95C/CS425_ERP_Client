import React, { useState, useEffect } from 'react';
import { Button, Modal, Layout, Menu, Form, Input, DatePicker, Select, message, Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { useObserver } from 'mobx-react-lite';
import * as style from './index.scss';
import { jobs } from '../../../../constants';
import { storeContext } from '../../../../components/context';
import { addEmployee } from '../../../../api/table';
import { getRoleList } from '../../../../api/table';

const { Sider, Content } = Layout;
const { Option } = Select;
const workTypeOptions = [['Hourly', 0], ['Salaried', 1]].map(([workType, value]) => <Option key={value} value={value}>{workType}</Option>);

export const AddEmployee: React.FC = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [currentMenu, setCurrentMenu] = useState<string>('1');
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const [roleOptions, setRoleList] = useState([]);
  const store = React.useContext(storeContext);
  if (!store) throw Error("Store shouldn't be null");
  const { refreshEmployeeList } = store.tableStore;

  const onCreateClick = () => {
   setModalVisible(true); 
  };

  const onCreate = (values) => {
    async function  fetchData() {
      try {
        await addEmployee(values);
        await refreshEmployeeList();
        setConfirmLoading(false);
        setModalVisible(false);
      } catch {
        setConfirmLoading(false);
        setModalVisible(false);
      }
    }

    try {
      setConfirmLoading(true);
      fetchData();
    } catch {
      setConfirmLoading(false);
      setModalVisible(false);
    }
  }

  useEffect(() => {
    getRoleList().then(result => {
      const { list } = result.data;
      const options = list.map(({roleID, role}) => <Option key={roleID} value={roleID}>{role}</Option>);
      setRoleList(options);
    });
  }, []);

  return useObserver(() => {
    const [form] = Form.useForm();
    const onMenuClick = (menu) => {
      setCurrentMenu(menu.key);
    }

    return (
      <div>
        <Button onClick={onCreateClick} type="primary" style={{ marginBottom: 16 }}>
          Create
        </Button>
        <Modal
          title="Create Person"
          style={{ top: 20 }}
          width={ 700 }
          visible={modalVisible}
          confirmLoading={confirmLoading}
          onCancel={() => setModalVisible(false)}
          onOk={() => {
            form
              .validateFields()
              .then(values => {
                onCreate(values);
              })
              .catch(info => {
                console.log('Validate Failed:', info);
              });
          }}
        >
          <Layout className={style.modal_layout}>
            { currentMenu == '1' ? 
              (<Content className={style.modal_layout_content}>
                <Form
                  labelCol={{ span: 8 }}
                  wrapperCol = {{ span: 16 }}
                  form={form}
                >
                  <Form.Item
                    name='firstName'
                    label='First Name'
                  >
                    <Input placeholder="First Name" />
                  </Form.Item>
                  <Form.Item
                    name='lastName'
                    label='Last Name'
                  >
                    <Input placeholder="First Name" />
                  </Form.Item>
                  <Form.Item
                    name='workType'
                    label='Work Type'
                  >
                    <Select
                      placeholder="Select"
                      allowClear
                    >
                      {workTypeOptions}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name='salary'
                    label='Salary'
                  >
                    <Input placeholder="Salary" />
                  </Form.Item>
                  {/*
                  <Form.Item
                    name='role'
                    label='Role'
                  >
                    <Select
                      placeholder="Select"
                      allowClear
                    >
                      {roleOptions}
                    </Select>
                  </Form.Item>
                  */}
                  <Form.Item
                    name='ssn'
                    label='SSN'
                  >
                    <Input placeholder="SSN" />
                  </Form.Item>
                  <Form.Item
                    name='city'
                    label='City'
                  >
                    <Input placeholder="City" />
                  </Form.Item>
                  <Form.Item
                    name='state'
                    label='State'
                  >
                    <Input placeholder="State" />
                  </Form.Item>
                  <Form.Item
                    name='streetName'
                    label='Street Name'
                  >
                    <Input placeholder="Street Name" />
                  </Form.Item>
                  <Form.Item
                    name='streetNumber'
                    label='Street Number'
                  >
                    <Input placeholder="Street Number" />
                  </Form.Item>
                  <Form.Item
                    name='aptNumber'
                    label='AptNumber'
                  >
                    <Input placeholder="AptNumber" />
                  </Form.Item>
                  <Form.Item
                    name='zip'
                    label='Zip'
                  >
                    <Input placeholder="Zip" />
                  </Form.Item>
                  </Form>
                </Content>) : (
                  <div style={{margin: '0 auto'}}>
                    <Upload.Dragger name="files" action="/upload.do">
                      <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                      </p>
                      <p className="ant-upload-text">Click or drop files here to upload</p>
                    </Upload.Dragger>
                  </div>
                )
            }
          </Layout>
        </Modal>
      </div>
    );
  });
}
