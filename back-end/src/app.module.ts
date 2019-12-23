import { ServicesModule } from './services/services.module';
import { QrService } from './services/qr.service';
import { AuthGuard } from './guards/authguard.service';
import { NotificationModule } from './notification/notification.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { AccountModule } from './account/account.module';
import { HubModule } from './hub/hub.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';

@Module({
  imports: [
        ServicesModule, 
    NotificationModule,
    AuthenticationModule,
    AccountModule,
    HubModule,
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
    }),
  ],
  controllers: [AppController],
  providers: [AuthGuard, AppService],
})
export class AppModule {}
