import { ApolloServer } from "apollo-server-azure-functions";
import { useContainer } from "class-validator";
import { Container } from "typedi";
import { createAzureSqlDbConnection } from "../src/deploymentConfigs/createAzureSqlDbConnection";
import { serverlessEnvChecker } from "../src/deploymentConfigs/serverlessEnvChecker";
import { IMyContext } from "../src/graphQL/context.interface";
import { configuredSchemaSync } from "../src/graphQL/schemaBuilder";

// const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
//     context.log('HTTP trigger function processed a request.');
//     const name = (req.query.name || (req.body && req.body.name));

//     if (name) {
//         context.res = {
//             // status: 200, /* Defaults to 200 */
//             body: "Hello " + (req.query.name || req.body.name)
//         };
//     }
//     else {
//         context.res = {
//             status: 400,
//             body: "Please pass a name on the query string or in the request body"
//         };
//     }
// };

useContainer(Container);
serverlessEnvChecker();
createAzureSqlDbConnection()
  .then((connection) => console.log("Connected to Azure SQL with TypeORM."))
  .catch((error) => console.log(error));;

// const run = async () => {
  const schema = configuredSchemaSync();

  const server = new ApolloServer({
      schema,
      context: ({ req, res }: IMyContext): IMyContext => {
          const context = {
            req,
            res,
          };
          return context as any;
        },
  });

  exports.graphqlHandler = server.createHandler({
    cors: {
      origin: '*',
      credentials: true,
    },
  });
// }

// export default run;

// // Construct a schema, using GraphQL schema language
// const typeDefs = gql`
//   type Query {
//     hello: String
//   }
// `;

// // Provide resolver functions for your schema fields
// const resolvers = {
//   Query: {
//     hello: () => 'Hello world!',
//   },
// };

// const server = new ApolloServer({ typeDefs, resolvers });

// exports.graphqlHandler = server.createHandler();
