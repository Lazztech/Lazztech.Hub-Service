import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { File } from '../dal/entity/file.entity';
import { Block } from '../dal/entity/block.entity';
import { Invite } from '../dal/entity/invite.entity';
import { JoinUserHub } from '../dal/entity/joinUserHub.entity';
import { User } from '../dal/entity/user.entity';
import { EmailModule } from '../email/email.module';
import { FileModule } from '../file/file.module';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { JoinEventFile } from '../dal/entity/joinEventFile.entity';
import { JoinHubFile } from '../dal/entity/joinHubFile.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([
      JoinUserHub, 
      User, 
      Invite, 
      Block, 
      File,
      JoinEventFile,
      JoinHubFile,
    ]),
    FileModule,
    EmailModule,
  ],
  controllers: [],
  providers: [UserService, UserResolver],
  exports: [UserService],
})
export class UserModule {}
