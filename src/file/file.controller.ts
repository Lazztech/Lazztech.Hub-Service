import { Controller, Get, Inject } from '@nestjs/common';
import { FileServiceInterface } from './file-service.interface';
import { FILE_SERVICE } from './file-service.token';

@Controller('file')
export class FileController {
  constructor(
    @Inject(FILE_SERVICE)
    private readonly fileService: FileServiceInterface,
  ) {}

  @Get()
  async get(fileIdentifier: string) {
    return this.fileService.get(fileIdentifier);
  }
}
