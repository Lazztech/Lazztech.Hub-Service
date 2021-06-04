import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordReset } from '../dal/entity/passwordReset.entity';
import { EmailService } from './email.service';

@Module({
  imports: [TypeOrmModule.forFeature([PasswordReset])],
  controllers: [],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
