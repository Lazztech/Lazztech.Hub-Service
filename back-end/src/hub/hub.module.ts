import { Module } from '@nestjs/common';
import { HubResolver } from './hub.resolver';
import { ServicesModule } from 'src/services/services.module';

@Module({
  imports: [ServicesModule],
  controllers: [],
  providers: [HubResolver],
})
export class HubModule {}
