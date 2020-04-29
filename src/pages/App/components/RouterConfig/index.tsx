import React from "react";
import { useObserver } from 'mobx-react-lite';
import { Route, Switch } from 'react-router-dom';
import { AuthorizedRoute } from '../../../../routes/AuthorizedRoute';

export const RouterConfig = (props) => {
  const { routes, parentPath = '' } = props;
  return useObserver(() => {
    return (
        <Switch>
          {routes.map(route => {
            const path = `${parentPath}/${route.path}`.replace(
                /\/+/g,
                '/'
            );
            if (route.children) {
              const Children = <RouterConfig routes = {route.children} parentPath = { path } />;
              return (
                <Route
                    key={path}
                    path={path}
                    render={() => {
                        return Children;
                    }}
                />
              );
            }
            return (
              <AuthorizedRoute
                key={path}
                path={path}
                Component={route.component}
              />
            );
          })}
        </Switch>
      );
  }); 
}
