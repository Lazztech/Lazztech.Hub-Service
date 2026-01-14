import { Controller, Get, Header, Inject, Logger, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { ImageFileService } from '../image-file/image-file.service';
import { FileService } from '../file-service.abstract';

@Controller('file')
export class FileController {
  private logger = new Logger(FileController.name);

  constructor(
    @Inject()
    private readonly fileService: FileService,
    private readonly imageService: ImageFileService,
  ) {}

  @Get(':fileName')
  @Header('Cache-Control', 'public, max-age=86400') // public for CDN, max-age= 24hrs in seconds
  async get(@Param('fileName') fileName: string, @Res() response: Response) {
    (await this.fileService.get(fileName)).on('error', (err) => {
      this.logger.error(err);
      response.status(500).send(err);
    }).pipe(response);
  }

    @Get('watermark/:shareableId')
  @Header('Cache-Control', 'public, max-age=86400') // public for CDN, max-age= 24hrs in seconds
  @Header('content-type', 'image/jpeg')
  async watermark(
    @Param('shareableId') shareableId: string,
    @Res() response: Response,
  ) {
    const fileStream = await this.fileService.getByShareableId(shareableId);
    const readable = await this.fileService.watermarkImage(fileStream);
    readable?.pipe(response).on('error', (err) => {
      this.logger.error(err);
      response.status(500).send(err);
    });
  }
}
