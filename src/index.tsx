
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/globals.css';
import './styles/theme.css';


const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    {/* Wrap with providers if needed */}
    {/* <ThemeProvider> */}
      {/* <AuthProvider> */}
        <BrowserRouter>
          <App />
        </BrowserRouter>
      {/* </AuthProvider> */}
    {/* </ThemeProvider> */}
  </React.StrictMode>
);
