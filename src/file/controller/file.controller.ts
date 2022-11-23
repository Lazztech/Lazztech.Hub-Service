import { Controller, Get, Header, Inject, Logger, NotFoundException, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { readFile } from 'fs/promises';
import { join, resolve } from 'path';
import sharp from 'sharp';
import { FILE_SERVICE } from '../file-service.token';
import { ImageFileService } from '../image-file/image-file.service';
import { FileServiceInterface } from '../interfaces/file-service.interface';

@Controller('file')
export class FileController {
  private logger = new Logger(FileController.name);

  constructor(
    @Inject(FILE_SERVICE)
    private readonly fileService: FileServiceInterface,
    private readonly imageService: ImageFileService,
  ) {}

  @Get(':fileName')
  @Header('Cache-Control', 'public, max-age=86400') // public for CDN, max-age= 24hrs in seconds
  get(@Param('fileName') fileName: string, @Res() response: Response) {
    this.fileService.get(fileName).on('error', (err) => {
      this.logger.error(err);
      response.status(500).send(err);
    }).pipe(response);
  }

  @Get('watermark/:fileName')
  @Header('Cache-Control', 'public, max-age=86400') // public for CDN, max-age= 24hrs in seconds
  @Header('content-type', 'image/jpeg')
  async watermark(@Param('fileName') fileName: string, @Res() response: Response) {
    const watermark = await sharp(
      join(process.cwd(), 'public', 'assets', 'lazztech_icon.png')
    ).resize(150, 150).toBuffer();
    this.fileService.get(fileName).pipe(
      sharp()
        .jpeg()
        .resize(1080, 1080, { fit: sharp.fit.inside })
        .composite([
          { input: watermark, left: 50, top: 50 },
        ])
    ).pipe(response).on('error', (err) => {
      this.logger.error(err);
      response.status(500).send(err);
    });
  }
}
