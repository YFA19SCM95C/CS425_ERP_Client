import React, { useState } from 'react';
import { Button, Modal, Layout, Menu, Form, Input, DatePicker, Select, message, Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { useObserver } from 'mobx-react-lite';
import * as style from './index.scss';
import { jobs } from '../../../../constants';
import { storeContext } from '../../../../components/context';
import { addUser, getRoleList, grantAccess, createView } from '../../../../api/table';

const { Sider, Content } = Layout;
const { Option } = Select;
const options = jobs.map((job) => <Option key={job} value={job}>{job}</Option>);

export const CreateView: React.FC = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [currentMenu, setCurrentMenu] = useState<string>('1');
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const store = React.useContext(storeContext);
  if (!store) throw Error("Store shouldn't be null");
  const { refreshAccessList } = store.tableStore;
  const [roleOptions, setRoleList] = useState([]);

  const onCreateClick = () => {
   setModalVisible(true); 
  };

  const onCreate = (values) => {
    async function  fetchData() {
      await createView(values);
      setConfirmLoading(false);
      setModalVisible(false);
      message.success('Create View Success');
    }

    try {
      // setConfirmLoading(true);
      fetchData();
    } catch {
      setConfirmLoading(false);
      setModalVisible(false);
    }
  }

  React.useEffect(() => {
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
          Create View
        </Button>
        <Modal
          title="Grant Access"
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
                    name='viewName'
                    label='View Name'
                  >
                    <Input placeholder="String Only" />
                  </Form.Item>
                  <Form.Item
                    name='tableName'
                    label='Table Name'
                  >
                    <Input placeholder="String Only" />
                  </Form.Item>
                  <Form.Item
                    name='columnName'
                    label='Column Name'
                  >
                    <Input placeholder="String Only" />
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
