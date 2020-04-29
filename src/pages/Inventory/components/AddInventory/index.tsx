import React, { useState, useEffect } from 'react';
import { Button, Modal, Layout, Menu, Form, Input, DatePicker, Select, message, Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { useObserver } from 'mobx-react-lite';
import * as style from './index.scss';
import { inventoryTypes } from '../../../../constants';
import { storeContext } from '../../../../components/context';
import { addUser, addInventory, getProductList } from '../../../../api/table';

const { Sider, Content } = Layout;
const { Option } = Select;
const options = inventoryTypes.map(([type, value]) => <Option key={value} value={value}>{type}</Option>);

export const AddInventory: React.FC = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [currentMenu, setCurrentMenu] = useState<string>('1');
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const [modelOptions, setModelList] = useState([]);
  const store = React.useContext(storeContext);
  if (!store) throw Error("Store shouldn't be null");
  const { refreshInventoryList } = store.tableStore;

  const onCreateClick = () => {
   setModalVisible(true); 
  };

  const onCreate = (values) => {
    values.leadTime = values.leadTime.format('YYYY-MM-DD HH:MM:SS');
    async function fetchData() {
      await addInventory(values);
      await refreshInventoryList();
      setConfirmLoading(false);
      setModalVisible(false);
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
    getProductList()
      .then(result => {
        const { list } = result.data;
        const modelOptions = list.map(model => <Option key={model.modelID} value={model.modelID}>{model.modelNumber}</Option>);
        setModelList(modelOptions);
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
                    name='modelID'
                    label='ModelID'
                  >
                    <Select
                      placeholder="Select"
                      allowClear
                    >
                      {modelOptions}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name="leadTime"
                    label="Lead Time"
                  >
                      <DatePicker className={style.range_picker} showTime={true} />
                    </Form.Item>
                    <Form.Item
                      name='inventoryName'
                      label='Inventory Name'
                    >
                      <Input placeholder="Inventory Name" />
                    </Form.Item>
                    <Form.Item
                      name='categoryType'
                      label='Category Type'
                    >
                      <Select
                        placeholder="Select"
                        allowClear
                      >
                        {options}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      name='number'
                      label='Number'
                    >
                      <Input placeholder="Number" />
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
