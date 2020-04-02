import { Logger } from '@nestjs/common';
import { GraphQLSchema } from 'graphql';
import { buildSchema } from 'type-graphql';
import Container from 'typedi';
import { AccountResolver } from '../../../src/user/account.resolver';
import { AuthenticationResolver } from '../../../src/user/authentication/authentication.resolver';
import { HubResolver } from '../../../src/hub/hub.resolver';
import { NotificationResolver } from '../../../src/notification/notification.resolver';

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
