import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { S3Module, S3ModuleOptions } from 'nestjs-s3';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions';
import { AuthModule } from './auth/auth.module';
import { User } from './dal/entity/user.entity';
import { FieldResolversModule } from './dal/field-resolvers/field-resolvers.module';
import { EmailModule } from './email/email.module';
import { FileModule } from './file/file.module';
import { HealthModule } from './health/health.module';
import { HubModule } from './hub/hub.module';
import { NotificationModule } from './notification/notification.module';
import { UserModule } from './user/user.module';

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
        const sqliteConfig = {
          ...commonSettings,
          type: 'sqlite',
          database: configService.get('DATABASE_SCHEMA', `sqlite3.db`),
        } as SqliteConnectionOptions;
        switch (configService.get('DATABASE_TYPE', 'sqlite')) {
          case '':
            AppModule.logger.log(
              `Using sqlite db: ${process.cwd()}/${sqliteConfig.database}`,
            );
            return sqliteConfig;
          case 'sqlite':
            AppModule.logger.log(
              `Using sqlite db: ${process.cwd()}/${sqliteConfig.database}`,
            );
            return sqliteConfig;
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
  public static logger = new Logger(AppModule.name, true);
}
