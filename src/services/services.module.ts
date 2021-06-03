import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordReset } from '../dal/entity/passwordReset.entity';
import { EmailService } from './email/email.service';

@Module({
  imports: [TypeOrmModule.forFeature([PasswordReset])],
  controllers: [],
  providers: [EmailService],
  exports: [EmailService],
})
export class ServicesModule {
  public static logger = new Logger(ServicesModule.name, true);
}
