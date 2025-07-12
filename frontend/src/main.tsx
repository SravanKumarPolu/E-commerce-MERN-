import './index.css';

import App from './App.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import { BrowserRouter } from 'react-router-dom';
import ShopContextProvider from './context/ShopContext.tsx';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ShopContextProvider>
          <App />
        </ShopContextProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);

