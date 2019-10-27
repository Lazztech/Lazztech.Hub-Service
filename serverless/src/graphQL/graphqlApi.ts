// import { ApolloServer, CorsOptions } from "apollo-server-express";
// import express from "express";
// import { IMyContext } from "./context.interface";
// import { configuredSchema } from "./schemaBuilder";

// export const register = async ( app: express.Application, cors: CorsOptions ) => {

//     const schema = await configuredSchema();

//     const apolloServer = new ApolloServer({
//         schema,
//         context: ({ req, res }: IMyContext): IMyContext => {
//           const context = {
//             req,
//             res,
//           };
//           return context as any;
//         },
//         // context: ({ req, res }: any) => ({ req, res })
//     });

//     apolloServer.applyMiddleware({ app, cors });
// };
