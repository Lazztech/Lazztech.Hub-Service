import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { S3Module, S3ModuleOptions } from 'nestjs-s3';
import { AuthModule } from './auth/auth.module';
import { FieldResolversModule } from './dal/field-resolvers/field-resolvers.module';
import { EmailModule } from './email/email.module';
import { FileModule } from './file/file.module';
import { HealthModule } from './health/health.module';
import { HubModule } from './hub/hub.module';
import { NotificationModule } from './notification/notification.module';
import { UserModule } from './user/user.module';
import * as path from 'path';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import * as Joi from 'joi';
import { MikroOrmModule, MikroOrmModuleOptions } from '@mikro-orm/nestjs';
import { Connection, IDatabaseDriver, MikroORM } from '@mikro-orm/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env'],
      validationSchema: Joi.object({
        APP_NAME: Joi.string().required(),
        ACCESS_TOKEN_SECRET: Joi.string().required(),
        FIREBASE_SERVER_KEY: Joi.string().required(),
        PUSH_NOTIFICATION_ENDPOINT: Joi.string().required(),
        EMAIL_FROM_ADDRESS: Joi.string().required(),
        EMAIL_PASSWORD: Joi.string().required(),
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
    PrometheusModule.register(),
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService,
      ) => {
        const commonSettings = {
          logger: (message) => console.log(message),
          // migrationsRun: true,
          migrations: {
            pattern: /^[\w-]+\d+|\d\.ts$/,
            transactional: true,
          },
          entities: [__dirname + '/dal/entity/**/*.*.*'],
        }  as MikroOrmModuleOptions<IDatabaseDriver<Connection>>;
        switch (configService.get('DATABASE_TYPE', 'sqlite')) {
          case 'sqlite':
            AppModule.logger.log(
              `Using sqlite db: ${path.join(
                process.cwd(),
                configService.get(
                  'DATABASE_SCHEMA',
                  path.join('data', 'sqlite3.db'),
                )
              )}`,
            );
            return {
              ...commonSettings,
              migrations: {
                ...commonSettings.migrations,
                path: __dirname + '/dal/migrations/sqlite/',
              },
              type: 'sqlite',
              baseDir: __dirname,
              dbName: configService.get(
                'DATABASE_SCHEMA',
                path.join('data', 'sqlite3.db'),
              ),
            } as MikroOrmModuleOptions<IDatabaseDriver<Connection>>;
          case 'postgres':
            AppModule.logger.log(
              `Using postgres db: ${configService.get(
                'DATABASE_SCHEMA',
                'postgres',
              )}, host: ${configService.get('DATABASE_HOST', 'localhost')}`,
            );
            return {
              ...commonSettings,
              migrations: {
                ...commonSettings.migrations,
                path: __dirname + '/dal/migrations/postgres/'
              },
              type: 'postgresql',
              dbName: configService.get('DATABASE_SCHEMA', 'postgres'),
              host: configService.get('DATABASE_HOST', 'localhost'),
              port: configService.get<number>('DATABASE_PORT', 5432),
              user: configService.get('DATABASE_USER', 'postgres'),
              password: configService.get('DATABASE_PASS', 'postgres'),
              driverOptions: {
                connection: {
                  ssl: configService.get('DATABASE_SSL')
                  ? {
                      rejectUnauthorized: false,
                    }
                  : undefined,
                }
              },
            } as MikroOrmModuleOptions<IDatabaseDriver<Connection>>;
          default:
            throw new Error(
              'Invalid database type selected. It must be either sqlite (default) or postgres.',
            );
        }
      },
    }),
    S3Module.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          config: {
            accessKeyId: configService.get(
              'OBJECT_STORAGE_ACCESS_KEY_ID',
              'minio',
            ),
            secretAccessKey: configService.get(
              'OBJECT_STORAGE_SECRET_ACCESS_KEY',
              'password',
            ),
            endpoint: configService.get(
              'OBJECT_STORAGE_ENDPOINT',
              'http://127.0.0.1:9000',
            ),
            s3ForcePathStyle: true,
            signatureVersion: 'v4',
          },
        } as S3ModuleOptions;
      },
    }),
    NotificationModule,
    HubModule,
    UserModule,
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      context: ({ req }) => ({ req }),
      cors: {
        credentials: true,
        origin: true,
      },
    }),
    AuthModule,
    FieldResolversModule,
    FileModule,
    HealthModule,
    EmailModule,
  ],
})
export class AppModule {
  public static logger = new Logger(AppModule.name);
}
