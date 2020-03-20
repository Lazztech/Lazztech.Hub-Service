import { FileService } from './services/file.service';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from './account/account.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticationModule } from './authentication/authentication.module';
import { AuthGuard } from './guards/authguard.service';
import { HubModule } from './hub/hub.module';
import { NotificationModule } from './notification/notification.module';
import { ServicesModule } from './services/services.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mssql',
      // url: "lazztechhub-db.database.windows.net",
      host: 'lazztechhub-db.database.windows.net',
      connectionTimeout: 25000,
      username: 'gian',
      password: 'Password123',
      database: 'lazztechhubdev-db',
      logging: false,
      // migrationsRun: true,
      extra: {
        options: {
          encrypt: true,
        },
      },
      synchronize: true,
      entities: [__dirname + '/dal/entity/**/*.*'],
      migrations: [__dirname + '/dal/mssqlMigrations/**/*.*'],
      subscribers: [__dirname + '/dal/mssqlMigrations/**/*.*'],
    }),
    ServicesModule,
    NotificationModule,
    AuthenticationModule,
    AccountModule,
    HubModule,
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
      context: ({ req }) => ({ req }),
      cors: {
        credentials: true,
        origin: true,
      },
    }),
  ],
  controllers: [AppController],
  providers: [FileService, AuthGuard, AppService],
})
export class AppModule {}
