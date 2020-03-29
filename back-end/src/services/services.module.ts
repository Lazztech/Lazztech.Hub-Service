import { Module } from '@nestjs/common';
import { QrService } from './qr.service';
import { EmailService } from './email.service';
import { FileService } from './file.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordReset } from 'src/dal/entity/passwordReset.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PasswordReset])],
  controllers: [],
  providers: [FileService, EmailService, QrService],
  exports: [FileService, EmailService, QrService],
})
export class ServicesModule {}
