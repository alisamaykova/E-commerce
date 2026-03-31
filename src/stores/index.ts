import { useContext } from 'react';

import { RootStoreContext } from './global/RootStore';
export { rootStore } from './global/instance';

export const useStore = () => {
  const context = useContext(RootStoreContext);
  if (!context) {
    throw new Error('useStore must be used within RootStoreProvider');
  }
  return context;
};

export { RootStore, RootStoreContext } from './global/RootStore';
