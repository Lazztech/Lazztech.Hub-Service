import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { ServicesModule } from 'src/services/services.module';
import { AccountResolver } from './account.resolver';
import { AuthenticationResolver } from './authentication.resolver';

@Module({
  imports: [ServicesModule],
  controllers: [],
  providers: [UserService, AccountResolver, AuthenticationResolver],
})
export class UserModule {}
