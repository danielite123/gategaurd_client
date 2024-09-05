import { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import App from './app';

// ----------------------------------------------------------------------

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <HelmetProvider>
    <BrowserRouter>
      <Suspense>
        <ToastContainer
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          limit={1} // Limits the number of toasts shown at once
          style={{
            width: '200px', // Set a smaller width for the toast container
            padding: '8px', // Reduce padding for a more compact look
          }}
          toastStyle={{
            fontSize: '14px', // Reduce the font size for smaller text
            padding: '10px', // Reduce the padding inside each toast
          }}
        />
        <App />
      </Suspense>
    </BrowserRouter>
  </HelmetProvider>
);
