import {
  ApolloClient,
  InMemoryCache,
  split,
  createHttpLink,
} from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient as createWsClient } from 'graphql-ws';
import { Kind, OperationTypeNode } from 'graphql';

const getApiUrl = (): string => {
  const url = import.meta.env.VITE_API_URL;
  if (typeof url !== 'string' || !url) {
    throw new Error('VITE_API_URL environment variable is not defined or is not a string');
  }
  return url;
};

const apiUrl = getApiUrl();

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
      definition.kind === Kind.OPERATION_DEFINITION &&
      definition.operation === OperationTypeNode.SUBSCRIPTION
    );
  },
  wsLink,
  httpLink
);

export const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache({}),
});