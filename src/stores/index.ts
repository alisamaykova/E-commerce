import { ProductStore } from './ProductStore';
import { RootStore } from './RootStore';

export const createStore = () => {
  const rootStore = new RootStore();

  (rootStore as any).productStore = new ProductStore();

  return rootStore;
};

export { RootStoreContext, useStore } from './RootStore';
