
import React from 'react';
import { createRoot } from 'react-dom/client';
import '../src/index.css';
import App from '../src/App'; 

const root = createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);