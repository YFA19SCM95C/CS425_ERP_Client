import React from "react";
import { storeContext } from '../context';
import { useObserver } from 'mobx-react-lite';

interface LoginCheckerProps {
  children: React.ReactNode;
}

export const LoginChecker: React.FC<LoginCheckerProps> = (props) => {
  const store = React.useContext(storeContext);
  if (!store) throw Error("Store shouldn't be null");
  return useObserver(() => {
    const { isLogin } = store.loginStore;
    return (
      <div>
        {isLogin.get() ? props.children : null}
      </div>
    );
  });
};
