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
  async file(fileIdentifier: string): Promise<any> {
    return await this.fileService.get(fileIdentifier);
  }
}
