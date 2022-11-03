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
import { SentryService } from '@ntegral/nestjs-sentry';
import { LogLevel } from '@nestjs/common';

async function bootstrap() {
  // Start SDK before nestjs factory create
  await otelSDK.start()
    .then(() => console.log('Tracing initialized'))
    .catch((error) => console.log('Error initializing tracing', error));;

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
  // Starts listening for shutdown hooks
  app.enableShutdownHooks();
  app.enable('trust proxy');
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });


  const sentry = SentryService.SentryServiceInstance();
  sentry.setLogLevels(logLevels)
  if (process.env.NODE_ENV !== 'development') {
    app.useLogger(sentry);
  }

  app.useGlobalInterceptors(new ModerationInterceptor());
  await app.listen(process.env.PORT || 8080);
}
bootstrap();
