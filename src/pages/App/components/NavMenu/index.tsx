import React, {useState} from "react";
import { useObserver } from 'mobx-react-lite';
import { Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { storeContext } from '../../../../components/context';
import { Route } from '../../../../interfaces';

const { SubMenu } = Menu;

export interface NavMenuProps {
  [propName: string]: any;
}

let defaultSelectedKeys = '/';

export const NavMenu: React.FC<NavMenuProps> = (props) => {
  const store = React.useContext(storeContext);
  if (!store) throw Error("Store shouldn't be null");
  const { isLogin } = store.loginStore;
  const { permissions } = store.permissionStore;
  const { pathname } = useLocation();
  const [ selectedKeys, setSelectedKeys ] = useState<string[]>([pathname]);
  const [ openKeys, setOpenKeys ] = useState(['']);
  const { routes, history } = props;
  const renderMenus = (routes: Route[] = [], parentPath = '') => {
    const permissionSet: Set<string> = new Set(permissions.get());
    return routes.map((route: Route) => {
      const path = `${parentPath}/${route.path}`.replace(/\/+/g, '/');
      const hasChildMenu = route.children;
      let hasPermission = true;
      if (route.permission !== undefined) {
        if (Array.isArray(route.permission)) {
          hasPermission = route.permission.some((permission) => permissionSet.has(permission));
        } else {
          hasPermission = permissionSet.has(route.permission);
        }
      }
      console.log('hasPermission', hasPermission, route.permission, permissionSet);
      if (!hasPermission) {
        return null;
      }
      if (hasChildMenu) {
        return (
          <SubMenu
            disabled={!isLogin.get()}
            title={<span>{route.icon}<span>{route.name}</span></span>}
            key={route.path}
          >
            {renderMenus(route.children, path)}
          </SubMenu>
        );
      }
      if (route.defaultSelected) {
        defaultSelectedKeys = path;
      }
      return (
        !route.hide && hasPermission && <Menu.Item key={path}>
          <Link to={path}>
            <span>{route.name}</span>
          </Link>
        </Menu.Item>
      );
    });
  }

  React.useEffect(() => {
    if (pathname == '/') {
      history.push(defaultSelectedKeys);
      setSelectedKeys([defaultSelectedKeys]);
    }
  }, [isLogin.get()]);

  const onMenuClick = (e) => {
    setSelectedKeys(e.key);
  };

  const onOpenChange = openKeys => {
    setOpenKeys(openKeys);
  };

  React.useMemo(() => {
    if (isLogin.get()) {
      setOpenKeys(['/' + defaultSelectedKeys.split('/')[1]]);
    } else {
      setOpenKeys([]);
    }
  }, [isLogin.get()]);

  return useObserver(() => {
    return (
      <Menu
        theme="light"
        mode="inline"
        openKeys={openKeys}
        onOpenChange={onOpenChange}
        selectedKeys={selectedKeys}
        onClick={onMenuClick}
        style={{height: '100%'}}
      >
        {renderMenus(routes)}
      </Menu>
    );
  }); 
}
