import { GraphQLSchema } from 'graphql';
import { buildSchema, buildSchemaSync } from 'type-graphql';
import Container from 'typedi';
import { AccountResolver } from '../account/account.resolver';
import { AuthenticationResolver } from '../authentication/authentication.resolver';
import { HubResolver } from '../hub/hub.resolver';
import { NotificationResolver } from '../notification/notification.resolver';
import { Logger } from '@nestjs/common';

const resolvers = [
  AuthenticationResolver,
  AccountResolver,
  NotificationResolver,
  HubResolver,
];
const container = Container;

export const configuredSchema = async (): Promise<GraphQLSchema> => {
  const logger = new Logger(configuredSchema.name, true);
  logger.log('executing');

  return await buildSchema({
    resolvers,
    container,
  });
};
