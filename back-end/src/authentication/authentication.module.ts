import { Module } from '@nestjs/common';
import { AuthenticationResolver } from './authentication.resolver';
import { ServicesModule } from 'src/services/services.module';

@Module({
  imports: [ServicesModule],
  controllers: [],
  providers: [AuthenticationResolver],
})
export class AuthenticationModule {}
