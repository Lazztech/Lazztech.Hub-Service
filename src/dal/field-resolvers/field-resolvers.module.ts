import { Module } from '@nestjs/common';
import { FileModule } from '../../file/file.module';
import { JoinUserHubsResolver as JoinUserHubsFieldResolver } from './joinUserHub-field.resolver';
import { UploadFieldResolver } from './upload-field.resolver';

@Module({
  imports: [FileModule],
  providers: [JoinUserHubsFieldResolver, UploadFieldResolver],
})
export class FieldResolversModule {}
