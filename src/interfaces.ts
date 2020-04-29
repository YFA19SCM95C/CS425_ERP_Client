import React from 'react';

export interface Route {
  path: string;
  children?: Route [];
  icon?: React.ReactNode;
  name?: string;
  defaultSelected?: boolean;
  hide?: boolean;
  component?: React.ReactNode;
  permission?: string | string[];
}
