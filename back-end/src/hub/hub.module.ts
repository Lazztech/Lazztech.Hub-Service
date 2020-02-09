import { Module } from '@nestjs/common';
import { HubResolver } from './hub.resolver';
import { ServicesModule } from 'src/services/services.module';
import { HubService } from './hub.service';
import { NotificationService } from 'src/notification/notification.service';

@Module({
  imports: [ServicesModule],
  controllers: [],
  providers: [HubResolver, HubService, NotificationService],
})
export class HubModule {}
