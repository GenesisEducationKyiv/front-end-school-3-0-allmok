import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import './index.css'; 
//import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AudioPlayerProvider } from './contexts/AudioPlayerContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, 
      retry: 1, 
    },
  },
});

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>

    <QueryClientProvider client={queryClient}>
      <AudioPlayerProvider>
        <App />
      </AudioPlayerProvider>
  {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  </React.StrictMode>
);