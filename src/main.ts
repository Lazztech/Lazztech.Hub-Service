import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as bodyParser from 'body-parser';
import { AppModule } from './app.module';
/* eslint-disable */
import express = require('express');

async function bootstrap() {
  const instance = express();
  instance.use('/avatars', require('adorable-avatars/dist/index'));
  const app = await NestFactory.create(AppModule, new ExpressAdapter(instance));
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