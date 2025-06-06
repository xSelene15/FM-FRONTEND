import React from 'react';
import ReactDOM from 'react-dom/client';
import { StrictMode } from 'react'
import { MessagesProvider } from './context/MessagesContext.jsx';
import { LoaderProvider } from './context/LoaderContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import './index.css'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <LoaderProvider>
        <MessagesProvider>
          <App />
        </MessagesProvider>
      </LoaderProvider>
    </AuthProvider>
  </React.StrictMode>
);