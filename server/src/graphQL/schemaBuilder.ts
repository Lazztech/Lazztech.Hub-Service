import { GraphQLSchema } from "graphql";
import { buildSchema } from "type-graphql";
import Container from "typedi";
import { customAuthChecker } from "./customAuthChecker";
import { AccountResolver } from "./resolvers/accountResolver";
import { AuthenticationResolver } from "./resolvers/authenticationResolver";
import { HelloResolver } from "./resolvers/helloResolver";
import { NotificationResolver } from "./resolvers/notificationResolver";
import { UserGroupResolver } from "./resolvers/userGroupResolver";
import { PersonImageResolver } from "./resolvers/personImageResolver";
import { PersonsFaceResolver } from "./resolvers/personsFaceResolver";

export const configuredSchema = async (): Promise<GraphQLSchema> => {
    return await buildSchema({
        resolvers: [
          HelloResolver,
          AuthenticationResolver,
          UserGroupResolver,
          AccountResolver,
          NotificationResolver,
          PersonImageResolver,
          PersonsFaceResolver
        ],
        container: Container,
        authChecker: customAuthChecker
      });
};
