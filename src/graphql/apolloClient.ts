import {
    ApolloClient,
    InMemoryCache,
    split,
    createHttpLink,
  } from '@apollo/client';
  import { getMainDefinition } from '@apollo/client/utilities';
  import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
  import { createClient as createWsClient } from 'graphql-ws';
  
  const apiUrl = import.meta.env.VITE_API_URL; 
  
  
  const httpLink = createHttpLink({
    uri: `${apiUrl}/graphql`,
  });
  
  const wsLink = new GraphQLWsLink(
    createWsClient({
      url: `${apiUrl.replace(/^http/, 'ws')}/graphql`,
    })
  );
  
  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    wsLink,
    httpLink
  );

  export const client = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache({
    }),
  });