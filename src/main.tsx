import React from 'react';
import ReactDOM from 'react-dom/client';
import { 
  ApolloClient, 
  InMemoryCache, 
  ApolloProvider, 
  HttpLink, 
  split 
} from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient as createWsClient } from 'graphql-ws';

import App from './App';
import { AudioPlayerProvider } from './contexts/AudioPlayerContext'; 
import './index.css';


const BACKEND_URL = 'localhost:8000';

const httpLink = new HttpLink({
  uri: `http://${BACKEND_URL}/graphql`
});

const wsLink = new GraphQLWsLink(createWsClient({
  url: `ws://${BACKEND_URL}/graphql`
}));

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink, 
  httpLink,
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <AudioPlayerProvider>
        <App />
      </AudioPlayerProvider>
    </ApolloProvider>
  </React.StrictMode>
);