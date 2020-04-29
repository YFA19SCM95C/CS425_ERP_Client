import React, {useState} from "react";
import { Layout } from "antd";
import "antd/dist/antd.css";
import  * as style from "./index.scss";
import StoreProvider from '../../components/context';
import { BreadCrumd } from './components/BreadCrumb';
import { MenuOutlined } from '@ant-design/icons';
import { Login } from '../../components/Login';
import { RouterConfig } from './components/RouterConfig';
import { NavMenu } from './components/NavMenu';
import { LoginChecker } from '../../components/LoginChecker';
import { PageLayout } from '../PageLayout';
import { Route } from '../../interfaces';

const { Header, Sider, Content } = Layout;

export interface AppProps {
  routes: Route[];
}

export const App: React.FC<AppProps> = (props) => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <StoreProvider>
      <PageLayout>
        <Layout style={{height: '100vh'}}>
          <Header className={style.header}>
            <MenuOutlined onClick={() => { setCollapsed(!collapsed); }}/>
            <span className={style.text}>ERP</span>
            <div className={style.login}>
              <Login />
            </div>
          </Header>
          <Layout>
            <Sider trigger={null} collapsible collapsed={collapsed} theme="light" width={256}>
              <NavMenu {...props} />
            </Sider>
            <Layout className={style.layout}>
              <LoginChecker>
                <div className={style.breadcrumd}>
                  <BreadCrumd {...props}/>
                </div>
              </LoginChecker>
              <Content
                style={{
                  background: '#fff',
                }}
              >
                <RouterConfig {...props} />
              </Content>
            </Layout>
          </Layout>
        </Layout>
      </PageLayout>
    </StoreProvider>)
};
