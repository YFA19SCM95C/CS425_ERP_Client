import React from "react";
import { HashRouter as Router, Route } from "react-router-dom";
import { Login }  from '../pages/Login/';
import { App } from '../pages/App';
import { FilterTable as User } from '../pages/Table';
import { Customer } from '../pages/Customer';
import { Product } from '../pages/Product';
import { Inventory } from '../pages/Inventory';
import { Order } from '../pages/Order';
import { Access } from '../pages/Access';
import { Chart } from '../pages/Chart';
import { PushpinOutlined } from '@ant-design/icons';

const routes = [
  {
    path: '/login',
    component: Login,
    name: 'login',
    hide: true
  },
  {
    path: '/em',
    name: 'Employee Management',
    icon: <PushpinOutlined style={{transform: 'rotateY(180deg)'}} />,
    children: [
      {
        path: '/employee',
        name: 'Employee',
        component: User,
      },
    ],
    permission: ['9', '10'],
  },
  {
    path: '/cm',
    name: 'Customer Management',
    icon: <PushpinOutlined style={{transform: 'rotateY(180deg)'}} />,
    children: [
      {
        path: '/customer',
        name: 'Customer',
        component: Customer,
      },
    ],
    permission: '4'
  },
  {
    path: '/pm',
    name: 'Product Management',
    icon: <PushpinOutlined style={{transform: 'rotateY(180deg)'}} />,
    children: [
      {
        path: '/model',
        name: 'Model',
        component: Product,
      },
      {
        path: '/inventory',
        name: 'Inventory',
        component: Inventory,
      },
    ],
    permission: '7',
  },
  {
    path: '/om',
    name: 'Order Management',
    icon: <PushpinOutlined style={{transform: 'rotateY(180deg)'}} />,
    children: [
      {
        path: '/order',
        name: 'Order',
        component: Order,
      },
    ],
    permission: '5',
  },
  {
    path: '/am',
    name: 'Access Management',
    icon: <PushpinOutlined style={{transform: 'rotateY(180deg)'}} />,
    children: [
      {
        path: '/access',
        name: 'Access',
        component: Access,
      },
    ],
    permission: '2',
  },
];

function AppRouter() {
  return (
    <Router>
      <Route
        path="/"
        render={props => {
            return <App {...props} routes={routes} />;
        }}
      />
    </Router>
  );
}

export default AppRouter;
