import { ApolloError } from '@apollo/client';
import { AppError } from '../types/errors';

export const mapApolloErrorToAppError = (apolloError: ApolloError): AppError => ({
  type: 'UnknownError',
  message: apolloError.message,
  originalError: apolloError,
});