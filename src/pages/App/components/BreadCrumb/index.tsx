import React from 'react';
import { Breadcrumb } from 'antd';
import { useObserver } from 'mobx-react-lite';
import { useLocation, Link } from 'react-router-dom';
import { Route } from '../../../../interfaces';

export interface BreadCrumdProps {
  routes: Route[];
}

const genBreadcrumbNameMap = (routes, parentPath, breadcrumbNameMap) => {
  for (const route of routes) {
    const path = (parentPath == '/' ? '' : parentPath) + route.path;
    breadcrumbNameMap[path] = route.name;
    if (route.children) {
      genBreadcrumbNameMap(route.children, path, breadcrumbNameMap);
    }
  }
  return breadcrumbNameMap;
}

export const BreadCrumd: React.FC<BreadCrumdProps> = (props) => {
  const { routes } = props;
  const breadcrumbNameMap = genBreadcrumbNameMap(routes, '', {});
  const { pathname } = useLocation();
  const pathSnippets = pathname.split('/').filter(i => i);
  const breadcrumbItems = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
    return (
      <Breadcrumb.Item key={url}>
        <Link to={url}>{breadcrumbNameMap[url]}</Link>
      </Breadcrumb.Item>
    );
  });

  return useObserver(() => {
    return (
      <Breadcrumb style={{ margin: '16px 0' }}>{breadcrumbItems}</Breadcrumb>
    );
  });
}
