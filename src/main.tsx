import React from 'react';
import ReactDOM from 'react-dom/client';
import { ApolloProvider } from '@apollo/client';

import { client } from './graphql/apolloClient';

import App from './App';
import { AudioPlayerProvider } from './contexts/AudioPlayerContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <AudioPlayerProvider>
        <App />
      </AudioPlayerProvider>
    </ApolloProvider>
  </React.StrictMode>
);