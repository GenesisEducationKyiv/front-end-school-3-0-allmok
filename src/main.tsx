import React from 'react';
import ReactDOM from 'react-dom/client';
import { ApolloProvider } from '@apollo/client';

import { client } from './graphql/apolloClient';

import App from './App';
import { AudioPlayerProvider } from './contexts/AudioPlayerProvider';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Failed to find the root element. Check your index.html file.");
}
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <AudioPlayerProvider>
        <App />
      </AudioPlayerProvider>
    </ApolloProvider>
  </React.StrictMode>
);