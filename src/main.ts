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
import { join } from 'path';
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const instance = express();
  instance.use('/avatars', require('adorable-avatars/dist/index'));

  const app: NestExpressApplication = await NestFactory.create(
    AppModule,
    new ExpressAdapter(instance), {
    bufferLogs: true,
    });
    app.useLogger(app.get(Logger));

  // for MVC server side rendering
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  // Starts listening for shutdown hooks
  app.enableShutdownHooks();
  app.enable('trust proxy');
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  app.use(graphqlUploadExpress({ maxFileSize: 1000000 * 10, maxFiles: 10 }));
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

    // Proxy endpoints
    app.use('/protomaps/tiles.pmtiles', createProxyMiddleware({
      target: 'https://lazztech-hub.sfo3.digitaloceanspaces.com', // used 'Origin Endpoint' not 'CDN Endpoint'
      pathRewrite: {
        '^/protomaps/tiles.pmtiles': '/protomaps/maps.pmtiles', // rewrite path
      },
        changeOrigin: true,
        onProxyRes: (proxyRes, req, res) => {
        proxyRes.headers['cache-control'] = 'public, max-age=31536000, immutable';
        proxyRes.headers['accept-ranges'] = 'bytes';
      },
    }));

  app.useGlobalInterceptors(new ModerationInterceptor());
  await app.listen(process.env.PORT || 8080);
}
bootstrap();
