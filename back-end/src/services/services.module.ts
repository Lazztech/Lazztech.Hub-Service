import { Module } from '@nestjs/common';
import { QrService } from './qr.service';
import { EmailService } from './email.service';
import { FileService } from './file.service';

@Module({
  imports: [],
  controllers: [],
  providers: [FileService, EmailService, QrService],
  exports: [FileService, EmailService, QrService],
})
export class ServicesModule {}
