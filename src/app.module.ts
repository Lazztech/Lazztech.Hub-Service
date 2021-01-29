import { Module } from '@nestjs/common';
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
import { DefaultAdminModule, DefaultAdminSite } from 'nestjs-admin';
import { Hub } from './dal/entity/hub.entity';
import { InAppNotification } from './dal/entity/inAppNotification.entity';
import { Invite } from './dal/entity/invite.entity';
import { JoinUserHub } from './dal/entity/joinUserHub.entity';
import { JoinUserInAppNotifications } from './dal/entity/joinUserInAppNotifications.entity';
import { MicroChat } from './dal/entity/microChat.entity';
import { PasswordReset } from './dal/entity/passwordReset.entity';
import { UserDevice } from './dal/entity/userDevice.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env'],
      isGlobal: true,
    }),
    DefaultAdminModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres' as const,
        host: configService.get('DATABASE_HOST', 'localhost'),
        port: configService.get<number>('DATABASE_PORT', 5432),
        username: configService.get('DATABASE_USER', 'postgres'),
        password: configService.get('DATABASE_PASS', 'postgres'),
        database: configService.get('DATABASE_SCHEMA', 'postgres'),
        extra: {
          ssl: configService.get('DATABASE_SSL', true),
        },
        logging: true,
        // migrationsRun: true,
        synchronize: true,
        entities: [
          __dirname + '/dal/entity/**/*.*.*',
          'node_modules/nestjs-admin/**/*.entity.js',
        ],
        migrations: [__dirname + '/dal/migrations/**/*.*'],
        subscribers: [__dirname + '/dal/migrations/**/*.*'],
      }),
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
      autoSchemaFile: 'schema.gql',
      context: ({ req }) => ({ req }),
      cors: {
        credentials: true,
        origin: true,
      },
    }),
    AuthModule,
  ],
  controllers: [HealthController],
})
export class AppModule {
  constructor(private readonly adminSite: DefaultAdminSite) {
    // Register the User entity under the "User" section
    adminSite.register('Lazztech Hub', Hub);
    adminSite.register('Lazztech Hub', InAppNotification);
    adminSite.register('Lazztech Hub', Invite);
    adminSite.register('Lazztech Hub', JoinUserHub);
    adminSite.register('Lazztech Hub', JoinUserInAppNotifications);
    adminSite.register('Lazztech Hub', MicroChat);
    adminSite.register('Lazztech Hub', PasswordReset);
    adminSite.register('Lazztech Hub', User);
    adminSite.register('Lazztech Hub', UserDevice);
  }
}
