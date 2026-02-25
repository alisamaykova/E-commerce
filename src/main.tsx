import './config/configureMobX.ts';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';
import App from './App.tsx';
import { RootStoreContext, createStore  } from './stores';
import { registerTestUser } from './api/auth'; 

registerTestUser().then(() => {
  console.log('Готово к работе с корзиной');
});

const store = createStore();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RootStoreContext.Provider value={store}>
    <App />
    </RootStoreContext.Provider>
  </StrictMode>
);
