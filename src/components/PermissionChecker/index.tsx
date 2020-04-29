import React from "react";
import { storeContext } from '../context';
import { useObserver } from 'mobx-react-lite';

interface PermissionCheckerProps {
  permission: number | string;
  children: React.ReactNode;
}

export const PermissionChecker: React.FC<PermissionCheckerProps> = (props) => {
  return useObserver(() => {
    const store = React.useContext(storeContext);
    if (!store) throw Error("Store shouldn't be null");
    const { permissions } = store.permissionStore;
    const { permission } = props;
    const permissionArr: (number | string) [] = permissions.get();
    return (
      <div>
        {~permissionArr.indexOf(permission) ? props.children : null}
      </div>
    );
  });
};
