import { useContext } from 'react';

import { ProductStore } from './ProductStore';
import { RootStore, RootStoreContext } from './RootStore';

export const createStore = () => {
  const rootStore = new RootStore();

  (rootStore as any).productStore = new ProductStore();

  return rootStore;
};

export const useStore = () => {
  const context = useContext(RootStoreContext);
  if (!context) throw new Error('...');
  return context;
};

export { RootStoreContext } from './RootStore';
