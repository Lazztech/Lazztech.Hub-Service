import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invite } from '../dal/entity/invite.entity';
import { JoinUserHub } from '../dal/entity/joinUserHub.entity';
import { User } from '../dal/entity/user.entity';
import { EmailModule } from '../email/email.module';
import { FileModule } from '../file/file.module';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([JoinUserHub, User, Invite]),
    FileModule,
    EmailModule,
  ],
  controllers: [],
  providers: [UserService, UserResolver],
  exports: [UserService],
})
export class UserModule {}