import { Module } from '@nestjs/common';
import { AccountResolver } from './account.resolver';
import { ServicesModule } from 'src/services/services.module';

@Module({
  imports: [ServicesModule],
  controllers: [],
  providers: [AccountResolver],
})
export class AccountModule {}
