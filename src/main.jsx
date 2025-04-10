import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Now theming is handled by ThemeProvider in App.jsx
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 