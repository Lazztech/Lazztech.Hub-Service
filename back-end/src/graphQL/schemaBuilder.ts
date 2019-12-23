import { GraphQLSchema } from 'graphql';
import { buildSchema, buildSchemaSync } from 'type-graphql';
import Container from 'typedi';
import { customAuthChecker } from './customAuthChecker';
import { AccountResolver } from '../account/account.resolver';
import { AuthenticationResolver } from '../authentication/authentication.resolver';
import { HubResolver } from '../hub/hub.resolver';
import { NotificationResolver } from '../notification/notification.resolver';

const resolvers = [
  AuthenticationResolver,
  AccountResolver,
  NotificationResolver,
  HubResolver,
];
const container = Container;
const authChecker = customAuthChecker;

export const configuredSchema = async (): Promise<GraphQLSchema> => {
  return await buildSchema({
    resolvers,
    container,
    authChecker,
  });
};

export const configuredSchemaSync = (): GraphQLSchema => {
  return buildSchemaSync({
    resolvers,
    container,
    authChecker,
  });
};
