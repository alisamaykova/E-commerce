import { createContext, useContext } from 'react';

import { AuthStore } from './AuthStore';
import { CartStore } from './CartStore';
import { QueryParamsStore } from './QueryParamsStore';

export class RootStore {
  cartStore: CartStore;
  authStore: AuthStore;
  queryParamsStore: QueryParamsStore;

  constructor() {
    this.queryParamsStore = new QueryParamsStore();
    this.cartStore = new CartStore(this);
    this.authStore = new AuthStore(this);
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
