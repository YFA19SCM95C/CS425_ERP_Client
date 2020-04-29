import React from 'react';
import { useLocalStore } from 'mobx-react-lite';
import { createStore, TStore } from '../store';

export const storeContext = React.createContext<TStore | null>(null);

export const StoreProvider: React.FC = (props) => {
  const store = useLocalStore(createStore);

  return (
    <storeContext.Provider value={store}>
      {props.children}
    </storeContext.Provider>
  );
};

export default StoreProvider;
