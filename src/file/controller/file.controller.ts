import { Controller, Get, Inject, Param, Res } from '@nestjs/common';
import { FileServiceInterface } from '../interfaces/file-service.interface';
import { FILE_SERVICE } from '../file-service.token';
import { Response } from 'express';

@Controller('file')
export class FileController {
  constructor(
    @Inject(FILE_SERVICE)
    private readonly fileService: FileServiceInterface,
  ) {}

  @Get(':fileName')
  get(@Param('fileName') fileName: string, @Res() response: Response) {
    this.fileService.get(fileName).pipe(response);
  }
}
