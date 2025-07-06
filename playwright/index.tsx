import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { client } from '../src/graphql/apolloClient';
import { AudioPlayerProvider } from '../src/contexts/AudioPlayerProvider'; 
import '../src/index.css';

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <React.StrictMode>
      <ApolloProvider client={client}>
        <BrowserRouter>
          <AudioPlayerProvider>
            {children}
          </AudioPlayerProvider>
        </BrowserRouter>
      </ApolloProvider>
    </React.StrictMode>
  );
};

export default TestWrapper;