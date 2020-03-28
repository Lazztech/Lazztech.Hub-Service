import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './config/configuration';
import { AuthGuard } from './guards/authguard.service';
import { HubModule } from './hub/hub.module';
import { NotificationModule } from './notification/notification.module';
import { FileService } from './services/file.service';
import { ServicesModule } from './services/services.module';
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
