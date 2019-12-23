// import { useContainer } from "class-validator";
// import cookieParser = require("cookie-parser");
// import dotenv from "dotenv";
// import express from "express";
// import fs from "fs";
// import https from "https";
// import "reflect-metadata";
// import { Container } from "typedi";
// import { createDockerDbConnection } from "./deploymentConfigs/createDockerDbConnection";
// import { createLocalDevDbConnection } from "./deploymentConfigs/createLocalDevDbConnection";
// import { checkEnvVariables } from "./deploymentConfigs/envChecker";
// // import * as graphqlApi from "./graphQL/graphqlApi";
// import { EmailService } from "./services/emailService";

// console.log("starting server");

// // Sets up TypeDI Dependency Injection Container
// useContainer(Container);

// // Creating express app
// const app = express();
// // Configure Express to parse incoming JSON data
// app.use( express.json() );
// // Used to help parse out cookies from requests
// app.use(cookieParser());

// // Configure Express to allow Cross Origin Scripting so server and client can communicate during dev
// const allowedOrigins = [
//         "capacitor://localhost",
//         "ionic://localhost",
//         "http://localhost",
//         "http://localhost:8080",
//         "http://localhost:8100",
//         "http://localhost:8101"
// ];

// const corsOptions = {
//         // origin: "http://localhost:8100",
//         origin: true,
//         credentials: true
// };

// // Register GraphQL setup middleware
// // graphqlApi.register( app, corsOptions );

// const emailer = new EmailService();
// try {
//     // initialize configuration
//     if (process.env.NODE_ENV === "docker") {
//     // DEPLOYMENT CONFIGURATION

//         checkEnvVariables();

//         // Typeorm connection
//         console.log("Connecting to docker db.");
//         createDockerDbConnection()
//             .then((connection) => console.log("Connected to docker Postgres with TypeORM."))
//             .catch((error) => console.log(error));

//         // start https server
//         const sslOptions = {
//             key: fs.readFileSync("/ssl/key.key").toString(),
//             cert: fs.readFileSync("/ssl/cert.pem").toString()
//         };

//         if (!sslOptions.cert || !sslOptions.key) {
//             console.error("SSL files not setup correctly!");
//         } else {
//             console.log(sslOptions);
//         }

//         const serverHttps = https.createServer(sslOptions, app).listen(443);

//         emailer.sendEmailToFromAddress("Started server", "Started server normally.");
//     } else {
//     // DEV CONFIGURATION

//         // Register .env file variables
//         dotenv.config();
//         checkEnvVariables();

//         const port = process.env.PORT;

//         // Typeorm connection
//         console.log("Connecting to local db.");
//         createLocalDevDbConnection()
//             .then((connection) => console.log("Connected to default ormconfig.json database with TypeORM."))
//             .catch((error) => console.log(error));

//         // start the Express server
//         app.listen( port, () => {
//             console.log( `Server started at http://localhost:${ port }` );
//             console.log(`Running a GraphQL API server at http://localhost:${ port }/graphql`);
//             emailer.sendEmailToFromAddress("Started debug server", "Started debug server.");
//         } );

//     }
// } catch (error) {
//     emailer.sendErrorToFromAddress(error);
// }
