import React from 'react';
import ReactDOM from 'react-dom/client';
import { StrictMode } from 'react'
import { MessagesProvider } from './context/MessagesContext.jsx';
import './index.css'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MessagesProvider>
      <App />
    </MessagesProvider>
  </React.StrictMode>
);