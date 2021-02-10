import { Module } from '@nestjs/common';
import { JoinUserHubsResolver } from './joinUserHub.resolver';

@Module({
  providers: [JoinUserHubsResolver],
})
export class FieldResolversModule {}
