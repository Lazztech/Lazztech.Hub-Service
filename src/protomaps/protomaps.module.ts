import { Module } from '@nestjs/common';
import { ProtomapsService } from './protomaps.service';
import { ProtomapsController } from './protomaps.controller';

@Module({
  providers: [ProtomapsService],
  controllers: [ProtomapsController]
})
export class ProtomapsModule {}
