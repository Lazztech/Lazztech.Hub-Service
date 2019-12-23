import { Module } from '@nestjs/common';
import { AccountResolver } from './account.resolver';

@Module({
  imports: [],
  controllers: [],
  providers: [AccountResolver],
})
export class AccountModule {}
