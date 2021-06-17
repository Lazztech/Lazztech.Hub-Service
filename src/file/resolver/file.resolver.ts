import { Inject } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { FILE_SERVICE } from '../file-service.token';
import { FileServiceInterface } from '../interfaces/file-service.interface';

@Resolver()
export class FileResolver {
  constructor(
    @Inject(FILE_SERVICE)
    private readonly fileService: FileServiceInterface,
  ) {}

  @Mutation(() => Boolean)
  async uploadFile(
    @Args({ name: 'file', type: () => GraphQLUpload })
    { createReadStream }: FileUpload,
  ): Promise<boolean> {
    return this.fileService.upload(createReadStream);
  }
}
