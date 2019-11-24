import { ApolloServer } from "apollo-server-azure-functions";
import { useContainer } from "class-validator";
import { Container } from "typedi";
import { createAzureSqlDbConnection } from "../src/deploymentConfigs/createAzureSqlDbConnection";
import { serverlessEnvChecker } from "../src/deploymentConfigs/serverlessEnvChecker";
import { IMyContext } from "../src/graphQL/context.interface";
import { configuredSchemaSync } from "../src/graphQL/schemaBuilder";
import { createLocalDevDbConnection } from "../src/deploymentConfigs/createLocalDevDbConnection";
import { HttpRequest } from "@azure/functions";
import { verify } from "jsonwebtoken";

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

// createLocalDevDbConnection()
//   .then(con => console.log("Connected to local postgres db."))
//   .catch(error => console.log(error));

// const run = async () => {
  const schema = configuredSchemaSync();

  const server = new ApolloServer({
      schema,
      context: (req: HttpRequest) => {
        //FIXME: This needs to be better understood and cleaned up.
        const req1 = req as any;
        const accessToken = req1.request.headers["authorization"];
        const data = accessToken ? verify(accessToken, process.env.ACCESS_TOKEN_SECRET) as any : undefined ;
        const context = {
          req: req1.request,
          userId: data ? data.userId : undefined
        };
        return context;
      },
  });

  exports.graphqlHandler = server.createHandler({
    cors: {
      origin: true,
      credentials: true,

    }
  });
