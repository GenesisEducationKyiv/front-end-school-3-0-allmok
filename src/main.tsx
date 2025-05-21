import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { AudioPlayerProvider } from './contexts/AudioPlayerContext';
import { Toaster } from 'react-hot-toast'; 
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AudioPlayerProvider>
      <App />
      <div data-testid="toast-container">
         <Toaster
            position="bottom-right" 
            toastOptions={{

              duration: 4000, 
              style: {
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)',
              },

              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10b981',
                  secondary: 'var(--bg-primary)',
                },
              },
               error: {
                duration: 5000, 
                 iconTheme: {
                  primary: '#ef4444',
                  secondary: 'var(--bg-primary)',
                },
              },
            }}
          />
      </div>
    </AudioPlayerProvider>
  </React.StrictMode>
);