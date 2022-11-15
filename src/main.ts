import otelSDK from './tracing';
import { NestFactory } from '@nestjs/core';
import {
  ExpressAdapter,
  NestExpressApplication
} from '@nestjs/platform-express';
import * as bodyParser from 'body-parser';
import { AppModule } from './app.module';
/* eslint-disable */
import express = require('express');
import { ModerationInterceptor } from './moderation/moderation.interceptor';
import { LogLevel } from '@nestjs/common';
import { join } from 'path';
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';

async function bootstrap() {
  // Start SDK before nestjs factory create
  await otelSDK.start()
    .then(() => console.log('Tracing initialized'))
    .catch((error) => console.log('Error initializing tracing', error));

  const instance = express();
  instance.use('/avatars', require('adorable-avatars/dist/index'));
  const logLevels: LogLevel[] = process.env.NODE_ENV === 'development' 
  ? ['log', 'debug', 'error', 'verbose', 'warn'] 
  : ['error'];
  const app: NestExpressApplication = await NestFactory.create(
    AppModule,
    new ExpressAdapter(instance),
    { logger: logLevels, }
  );

  // for MVC server side rendering
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  // Starts listening for shutdown hooks
  app.enableShutdownHooks();
  app.enable('trust proxy');
  app.use(graphqlUploadExpress({ maxFileSize: 1000000, maxFiles: 10 }));
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.useGlobalInterceptors(new ModerationInterceptor());
  await app.listen(process.env.PORT || 8080);
}
bootstrap();
