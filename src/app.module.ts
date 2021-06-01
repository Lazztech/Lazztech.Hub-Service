import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from './dal/entity/user.entity';
import { HubModule } from './hub/hub.module';
import { NotificationModule } from './notification/notification.module';
import { ServicesModule } from './services/services.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { HealthController } from './health/health.controller';
import { S3Module, S3ModuleOptions } from 'nestjs-s3';
import { FieldResolversModule } from './dal/field-resolvers/field-resolvers.module';
import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env'],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService,
      ): Promise<TypeOrmModuleOptions> => {
        const commonSettings = {
          logging: true,
          // migrationsRun: true,
          synchronize: true,
          entities: [__dirname + '/dal/entity/**/*.*.*'],
          migrations: [__dirname + '/dal/migrations/**/*.*'],
          subscribers: [__dirname + '/dal/migrations/**/*.*'],
        };
        AppModule.logger.log(
          `DATABASE_TYPE: ${configService.get<string>(
            'DATABASE_TYPE',
            'sqlite',
          )}`,
        );
        AppModule.logger.log(
          `DATABASE_SCHEMA: ${configService.get<string>(
            'DATABASE_SCHEMA',
            `${__dirname}/../hub-service.db`,
          )}`,
        );
        switch (configService.get('DATABASE_TYPE', 'sqlite')) {
          case 'sqlite':
            return {
              ...commonSettings,
              type: 'sqlite',
              database: configService.get(
                'DATABASE_SCHEMA',
                `${__dirname}/../hub-service.db`,
              ),
            } as SqliteConnectionOptions;
          case 'postgres':
            return {
              ...commonSettings,
              type: 'postgres' as const,
              database: configService.get('DATABASE_SCHEMA', 'postgres'),
              host: configService.get('DATABASE_HOST', 'localhost'),
              port: configService.get<number>('DATABASE_PORT', 5432),
              username: configService.get('DATABASE_USER', 'postgres'),
              password: configService.get('DATABASE_PASS', 'postgres'),
              extra: {
                ssl:
                  configService.get('DATABASE_SSL', false) === 'true'
                    ? true
                    : false,
              },
            } as PostgresConnectionOptions;
          default:
            throw new Error(
              'Invalid database type selected. It must be either sqlite (default) or postgres.',
            );
        }
      },
    } as TypeOrmModuleOptions),
    TypeOrmModule.forFeature([User]),
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
    ServicesModule,
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
  ],
  controllers: [HealthController],
})
export class AppModule {
  public static logger = new Logger(AppModule.name, true);
}
