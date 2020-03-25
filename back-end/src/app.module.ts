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
import { UserService } from './user/user.service';
import configuration from './config/configuration';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(AppService.getDevDbConnection()),
    ServicesModule,
    NotificationModule,
    AuthenticationModule,
    AccountModule,
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
  ],
  controllers: [AppController],
  providers: [FileService, AuthGuard, AppService],
})
export class AppModule {}
