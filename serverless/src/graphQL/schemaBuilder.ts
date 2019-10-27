import { GraphQLSchema } from "graphql";
import { buildSchema, buildSchemaSync } from "type-graphql";
import Container from "typedi";
import { customAuthChecker } from "./customAuthChecker";
import { AccountResolver } from "./resolvers/accountResolver";
import { AuthenticationResolver } from "./resolvers/authenticationResolver";
import { HelloResolver } from "./resolvers/helloResolver";
import { HubResolver } from "./resolvers/hubResolver";
import { NotificationResolver } from "./resolvers/notificationResolver";
import { PersonImageResolver } from "./resolvers/personImageResolver";
import { PersonsFaceResolver } from "./resolvers/personsFaceResolver";
import { UserGroupResolver } from "./resolvers/userGroupResolver";

const resolvers = [
  HelloResolver,
  AuthenticationResolver,
  UserGroupResolver,
  AccountResolver,
  NotificationResolver,
  PersonImageResolver,
  PersonsFaceResolver,
  HubResolver
];
const container = Container;
const authChecker = customAuthChecker;

export const configuredSchema = async (): Promise<GraphQLSchema> => {
    return await buildSchema({
        resolvers,
        container,
        authChecker
      });
};

export const configuredSchemaSync = (): GraphQLSchema => {
  return buildSchemaSync({
      resolvers,
      container,
      authChecker
    });
};
