import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import axios from 'axios';

axios.defaults.baseURL = 'http://127.0.0.1:8000';

const root = ReactDOM.createRoot(

  document.getElementById('root') as HTMLElement
);
root.render(
  // <React.StrictMode>
    <App />
  // </React.StrictMode>
);
