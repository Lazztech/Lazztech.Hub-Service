import { Controller, Get, Header, Inject, Logger, NotFoundException, Param, Res } from '@nestjs/common';
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
  @Header('Cache-Control', 'public, max-age=604800') // public for CDN, max-age= 1 week in seconds
  get(@Param('fileName') fileName: string, @Res() response: Response) {
    try {
      return this.fileService.get(fileName)?.pipe(response).on('err', err => {
        throw err
      });
    } catch (error) {
      throw new NotFoundException(error);
    }
  }
}
