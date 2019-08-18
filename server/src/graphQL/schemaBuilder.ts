import { GraphQLSchema } from "graphql";
import { buildSchema } from "type-graphql";
import Container from "typedi";
import { customAuthChecker } from "./customAuthChecker";
import { AccountResolver } from "./resolvers/accountResolver";
import { AuthenticationResolver } from "./resolvers/authenticationResolver";
import { HelloResolver } from "./resolvers/helloResolver";
import { NotificationResolver } from "./resolvers/notificationResolver";
import { UserGroupResolver } from "./resolvers/userGroupResolver";

export const configuredSchema = async (): Promise<GraphQLSchema> => {
    return await buildSchema({
        resolvers: [
          HelloResolver,
          AuthenticationResolver,
          UserGroupResolver,
          AccountResolver,
          NotificationResolver
        ],
        container: Container,
        authChecker: customAuthChecker
      });
};
