import React, {useState} from 'react';
import { useObserver } from 'mobx-react-lite';
import { storeContext } from '../context';
import { Modal, Form, Input, message, Popover, Avatar, List } from 'antd';
import { LoginOutlined } from '@ant-design/icons';
import * as style from './index.scss';

export const Login: React.FC = () => {
  const store = React.useContext(storeContext);
  if (!store) throw Error("Store shouldn't be null");
  const { isLogin, doLogin, doLogout, userInfo } = store.loginStore;
  const { getPermissions } = store.permissionStore;
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const onLoginClick = () => {
    setModalVisible(true);
  };

  const onLogoutClick = () => {
    async function logout() {
      await doLogout();
      location.reload();
    }
    logout();
  }

  const onCreate = (values) => {
    doLogin({ username: values.name, password: values.password }).then((result) => {
      const { ok } = result.data;
      if (ok != 1) {
        message.error('Login Failed');
        return;
      }
      getPermissions();
      setModalVisible(false);
    }).catch (() => {
      message.error('Login Failed');
    });
  };

  return useObserver(() => {
    const { name, email } = userInfo.get();
    const userInfoBox = (
      <List>
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
              title={name}
              description={email}
            />
          </List.Item>
          <List.Item>
            <span onClick={onLogoutClick}><LoginOutlined />  Log Out</span>
          </List.Item>
      </List>
    );
    const [form] = Form.useForm();
    const hasLogin = (
      <Popover
        className={style['not-login']}
        placement="bottomRight"
        trigger="click"
        content={userInfoBox}
      >
        <span style={{color: '#2673DD'}}>{name && name[0].toUpperCase()}
      </span>
      </Popover>);
    const notLogin = (
      <span>
        <span onClick={onLoginClick}>Log In</span>
        <Modal
          title="Log In"
          style={{ top: 20 }}
          width={ 500 }
          visible={modalVisible}
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
          <Form
            labelCol={{ span: 8 }}
            wrapperCol = {{ span: 16 }}
            form={form}
          >
            <Form.Item
              label="Username"
              name="name"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password />
            </Form.Item>
          </Form>
        </Modal>
      </span>
    );
    return isLogin.get() ? hasLogin : notLogin;
  });
}
