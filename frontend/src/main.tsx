import './index.css';

import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import ShopContextProvider from './context/ShopContext.tsx';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// ✅ REGISTER THE PWA SERVICE WORKER
import { registerSW } from 'virtual:pwa-register';

registerSW({
  immediate: true,
  onOfflineReady() {
    console.log('App is ready to work offline');
  }
});


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ShopContextProvider>
        <App />
        <ToastContainer 
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </ShopContextProvider>
    </BrowserRouter>
  </StrictMode>,
);

