import { Controller, Get, Inject, Logger, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { FILE_SERVICE } from '../file-service.token';
import { FileServiceInterface } from '../interfaces/file-service.interface';

@Controller('file')
export class FileController {
  private logger = new Logger(FileController.name);

  constructor(
    @Inject(FILE_SERVICE)
    private readonly fileService: FileServiceInterface,
  ) {}

  @Get(':fileName')
  get(@Param('fileName') fileName: string, @Res() response: Response) {
    this.fileService.get(fileName).on('error', (err) => this.logger.error(err)).pipe(response);
  }
}
