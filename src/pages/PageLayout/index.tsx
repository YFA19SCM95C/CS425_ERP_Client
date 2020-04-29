import React from "react";
import { storeContext } from '../../components/context';
import { useObserver } from 'mobx-react-lite';
import { Spin } from 'antd';

export const PageLayout: React.FC = (props) => {
  return useObserver(() => {
    const store = React.useContext(storeContext);
    if (!store) throw Error("Store shouldn't be null");
    const { getLoginStatus, isLogin } = store.loginStore;
    const { loading, setLoading } = store.appStore;
    const { getPermissions } = store.permissionStore;

    React.useEffect(() => {
      try {
        setLoading(true);
        getLoginStatus().then(() => {
          setLoading(false); 
          if (isLogin.get()) {
            getPermissions();
          }
        });
      } catch {
        setLoading(false); 
      }
    }, []);

    return (
      <div>
        <Spin spinning={loading.get()}>
          {props.children}
        </Spin>
      </div>)
  });
}
