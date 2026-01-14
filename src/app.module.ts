import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { GraphqlInterceptor, SentryModule } from '@ntegral/nestjs-sentry';
import { SeverityLevel } from '@sentry/node';
import * as Joi from 'joi';
import { S3Module, S3ModuleOptions } from 'nestjs-s3';
import * as path from 'path';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { DataloadersModule } from './dal/dataloaders/dataloaders.module';
import { FieldResolversModule } from './dal/field-resolvers/field-resolvers.module';
import { EmailModule } from './email/email.module';
import { EventModule } from './event/event.module';
import { FileModule } from './file/file.module';
import { HealthModule } from './health/health.module';
import { HubModule } from './hub/hub.module';
import { ModerationModule } from './moderation/moderation.module';
import { NotificationModule } from './notification/notification.module';
import { OpenGraphModule } from './open-graph/open-graph.module';
import { UserModule } from './user/user.module';
import GraphQLJSON from 'graphql-type-json';
import { DalModule } from './dal/dal.module';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const options = {
          singleLine: true,
          colorize: true,
          levelFirst: false,
          translateTime: 'yyyy-mm-dd HH:MM:ss',
          destination: 1,
        };
        return {
          pinoHttp: {
            transport: {
              targets: [
                {
                  target: 'pino-pretty',
                  level: 'info',
                  options,
                },
                {
                  target: 'pino-pretty',
                  level: 'info',
                  options: {
                    ...options,
                    // app.log file in data path
                    destination: path.join(
                      configService.getOrThrow('DATA_PATH'),
                      'app.log',
                    ),
                    mkdir: true,
                  },
                },
              ],
            },
          },
        };
      },
    }),
    SentryModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        dsn: configService.get('SENTRY_DSN'),
        debug: false,
        environment: 'production',
        release: null, // must create a release in sentry.io dashboard
        logLevels: ['error'], // based on sentry.io loglevel
        tracesSampleRate: 0,
        beforeSend: (event) => {
          // workaround to bug: https://github.com/ntegral/nestjs-sentry/pull/42#issuecomment-1021257277
          const excluded: Array<SeverityLevel> = [
            'debug',
            'info',
            'log',
            'warning'
          ];
          if (excluded.includes(event.level)) {
            return null;
          } else {
            return event;
          }
        },
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env'],
      validationSchema: Joi.object({
        APP_NAME: Joi.string().required(),
        DATA_PATH: Joi.string().default(path.join(process.cwd(), 'data')), 
        ACCESS_TOKEN_SECRET: Joi.string().required(),
        PUBLIC_VAPID_KEY: Joi.optional(),
        PRIVATE_VAPID_KEY: Joi.optional(),
        FIREBASE_SERVER_KEY: Joi.string().required(),
        PUSH_NOTIFICATION_ENDPOINT: Joi.string().required(),
        EMAIL_TRANSPORT: Joi.string()
          .valid('gmail', 'mailgun')
          .default('gmail'),
        EMAIL_API_KEY: Joi.when('EMAIL_TRANSPORT', {
            is: 'mailgun',
            then: Joi.string().required(),
            otherwise: Joi.optional()
          }),
        EMAIL_DOMAIN: Joi.when('EMAIL_TRANSPORT', {
            is: 'mailgun',
            then: Joi.string().required(),
          }),
        EMAIL_FROM_ADDRESS: Joi.string().required(),
        EMAIL_PASSWORD: Joi.when('EMAIL_TRANSPORT', {
            is: 'gmail',
            then: Joi.string().required(),
            otherwise: Joi.optional(),
          }),
        DATABASE_TYPE: Joi.string()
          .valid('sqlite', 'postgres')
          .default('sqlite'),
        DATABASE_SCHEMA: Joi.string()
          .when('DATABASE_TYPE', {
            is: 'sqlite',
            then: Joi.string().default(path.join('data', 'sqlite3.db')),
          })
          .when('DATABASE_TYPE', {
            is: 'postgres',
            then: Joi.string().required(),
          }),
        DATABASE_HOST: Joi.string().when('DATABASE_TYPE', {
          is: 'postgres',
          then: Joi.string().required(),
          otherwise: Joi.optional(),
        }),
        DATABASE_PORT: Joi.number().when('DATABASE_TYPE', {
          is: 'postgres',
          then: Joi.number().required(),
          otherwise: Joi.optional(),
        }),
        DATABASE_USER: Joi.string().when('DATABASE_TYPE', {
          is: 'postgres',
          then: Joi.string().required(),
          otherwise: Joi.optional(),
        }),
        DATABASE_PASS: Joi.string().when('DATABASE_TYPE', {
          is: 'postgres',
          then: Joi.string().required(),
          otherwise: Joi.optional(),
        }),
        DATABASE_SSL: Joi.boolean().when('DATABASE_TYPE', {
          is: 'postgres',
          then: Joi.boolean().default(false),
          otherwise: Joi.optional(),
        }),
        FILE_STORAGE_TYPE: Joi.string()
          .valid('local', 'object')
          .default('local'),
        OBJECT_STORAGE_BUCKET_NAME: Joi.string().when('FILE_STORAGE_TYPE', {
          is: 'object',
          then: Joi.string().required(),
          otherwise: Joi.optional(),
        }),
        OBJECT_STORAGE_ACCESS_KEY_ID: Joi.string().when('FILE_STORAGE_TYPE', {
          is: 'object',
          then: Joi.string().required(),
          otherwise: Joi.optional(),
        }),
        OBJECT_STORAGE_SECRET_ACCESS_KEY: Joi.string().when(
          'FILE_STORAGE_TYPE',
          {
            is: 'object',
            then: Joi.string().required(),
            otherwise: Joi.optional(),
          },
        ),
        OBJECT_STORAGE_ENDPOINT: Joi.string().when('FILE_STORAGE_TYPE', {
          is: 'object',
          then: Joi.string().required(),
          otherwise: Joi.optional(),
        }),
      }),
      validationOptions: {
        abortEarly: true,
      },
      isGlobal: true,
    }),
    S3Module.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          config: {
            credentials: {
              accessKeyId: configService.get(
                'OBJECT_STORAGE_ACCESS_KEY_ID',
                'minio',
              ),
              secretAccessKey: configService.get(
                'OBJECT_STORAGE_SECRET_ACCESS_KEY',
                'password',
              ),
            },
            endpoint: configService.get(
              'OBJECT_STORAGE_ENDPOINT',
              'http://127.0.0.1:9000',
            ),
            region: configService.get(
              'OBJECT_STORAGE_REGION',
              'us-east-1',
            ),
            forcePathStyle: true,
          },
        } as S3ModuleOptions;
      },
    }),
    NotificationModule,
    HubModule,
    UserModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      context: ({ req, res }) => ({ req, res }),
      fieldResolverEnhancers: ['interceptors'],
      resolvers: { JSON: GraphQLJSON },
    }),
    AuthModule,
    FieldResolversModule,
    FileModule,
    HealthModule,
    EmailModule,
    ModerationModule,
    EventModule,
    DataloadersModule,
    OpenGraphModule,
    DalModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useFactory: () => new GraphqlInterceptor(),
    },
    // SentryPlugin,
  ],
  controllers: [AppController]
})
export class AppModule {}
