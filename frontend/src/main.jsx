import React from 'react';
import ReactDOM from 'react-dom/client';  // Use 'react-dom/client' for createRoot
import './index.css'; // Make sure this file includes Tailwind
import App from './App';

// Create a root for the app
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the app
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
