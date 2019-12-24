import { Module } from '@nestjs/common';
import { QrService } from './qr.service';
import { EmailService } from './emailService';

@Module({
  imports: [],
  controllers: [],
  providers: [EmailService, QrService],
  exports: [EmailService, QrService],
})
export class ServicesModule {}
