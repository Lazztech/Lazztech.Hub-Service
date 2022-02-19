import { NestFactory } from '@nestjs/core';
import {
  ExpressAdapter,
  NestExpressApplication
} from '@nestjs/platform-express';
import * as bodyParser from 'body-parser';
import { AppModule } from './app.module';
/* eslint-disable */
import express = require('express');
const tracer = require('./tracer')

async function bootstrap() {
  await tracer.start();
  const instance = express();
  instance.use('/avatars', require('adorable-avatars/dist/index'));
  const app: NestExpressApplication = await NestFactory.create(
    AppModule,
    new ExpressAdapter(instance),
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
  await app.listen(process.env.PORT || 8080);
}
bootstrap();
