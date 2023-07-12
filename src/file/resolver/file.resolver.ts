import { Inject, UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Resolver } from '@nestjs/graphql';
import { GqlJwtAuthGuard } from 'src/auth/guards/gql-jwt-auth.guard';
import { UserId } from 'src/decorators/user.decorator';
import { FILE_SERVICE } from '../file-service.token';
import { FileServiceInterface } from '../interfaces/file-service.interface';

@UseGuards(GqlJwtAuthGuard)
@Resolver()
export class FileResolver {

    constructor(
        @Inject(FILE_SERVICE)
        private readonly fileService: FileServiceInterface,
    ) {}

    @Mutation(() => Boolean)
    public async deleteFileById(
      @UserId() userId,
      @Args({ name: 'fileId', type: () => ID}) fileId: any
    ) {
      return this.fileService.deleteById(fileId, userId).then(() => true);
    }
}
