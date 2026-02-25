import { createContext, useContext } from 'react';

import { CartStore } from './CartStore';
import { ProductStore } from './ProductStore';

export class RootStore {
  productStore: ProductStore;
  cartStore: CartStore;

  constructor() {
    this.productStore = new ProductStore();
    this.cartStore = new CartStore();
  }
}

export const RootStoreContext = createContext<RootStore | null>(null);

export const useStore = () => {
  const context = useContext(RootStoreContext);
  if (!context) {
    throw new Error('useStore must be used within RootStoreProvider');
  }
  return context;
};
