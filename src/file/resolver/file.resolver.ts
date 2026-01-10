import { Inject, UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Resolver } from '@nestjs/graphql';
import { GqlJwtAuthGuard } from '../../auth/guards/gql-jwt-auth.guard';
import { UserId } from '../../decorators/user.decorator';
import { FileService } from '../file-service.abstract';
@UseGuards(GqlJwtAuthGuard)
@Resolver()
export class FileResolver {

    constructor(
      @Inject()
      private readonly fileService: FileService,
    ) {}

    @Mutation(() => Boolean)
    public async deleteFileById(
      @UserId() userId,
      @Args({ name: 'fileId', type: () => ID}) fileId: any
    ) {
      return this.fileService.deleteById(fileId, userId).then(() => true);
    }
}
