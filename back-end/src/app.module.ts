import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './config/configuration';
import { User } from './dal/entity/user.entity';
import { AuthGuard } from './guards/authguard.service';
import { HubModule } from './hub/hub.module';
import { NotificationModule } from './notification/notification.module';
import { ServicesModule } from './services/services.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '***REMOVED***',
      username: '***REMOVED***',
      password: 'Password123',
      database: 'postgres',
      logging: false,
      // migrationsRun: true,
      synchronize: true,
      entities: [__dirname + '/dal/entity/**/*.*.*'],
      migrations: [__dirname + '/dal/migrations/**/*.*'],
      subscribers: [__dirname + '/dal/migrations/**/*.*'],
    }),
    TypeOrmModule.forFeature([User]),
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
  providers: [AuthGuard, AppService],
})
export class AppModule {}
