import './config/configureMobX.ts';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';
import App from './App.tsx';
import { RootStoreContext, RootStore  } from './stores';
import { initAuth } from './initAuth.ts';

const store = new RootStore();

initAuth(store).catch(console.error);

createRoot(document.getElementById('root')!).render(
 <StrictMode> 
    <RootStoreContext.Provider value={store}>
    <App />
    </RootStoreContext.Provider>
</StrictMode>
);
