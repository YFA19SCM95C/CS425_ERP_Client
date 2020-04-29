import React from 'react';
import { Route } from 'react-router-dom'
import { useObserver } from 'mobx-react-lite';
import { Login } from '../pages/Login';
import { storeContext } from '../components/context';

interface AuthorizedRouteProps { Component: React.FC; path: string }

export const AuthorizedRoute: React.FC<AuthorizedRouteProps> = ({ Component }) => {
  const store = React.useContext(storeContext);
  if (!store) throw Error("Store shouldn't be null");
  return useObserver(() => {
    const { isLogin } = store.loginStore;
    const isLoginStatus = isLogin.get();
    return (
      <Route render={() => {
					return isLoginStatus
							? <Component />
              : <Login />
				}} />
    );
  }); 
}
