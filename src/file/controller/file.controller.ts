import { Controller, Get, Header, Inject, Logger, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
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

  @Get('watermark/:shareableId')
  @Header('Cache-Control', 'public, max-age=86400') // public for CDN, max-age= 24hrs in seconds
  @Header('content-type', 'image/jpeg')
  async watermark(@Param('shareableId') shareableId: string, @Res() response: Response) {
    const watermark = await sharp(
      join(process.cwd(), 'public', 'assets', 'lazztech_icon.webp')
    ).resize(150, 150)
      .extend({
        top: 0,
        bottom: 20,
        left: 20,
        right: 0,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .composite([
        {
          input: Buffer.from([0, 0, 0, 200]),
          raw: {
            width: 1,
            height: 1,
            channels: 4,
          },
          tile: true,
          blend: 'dest-in',
        }
      ]).toBuffer();
    const fileStream = await this.fileService.getByShareableId(shareableId);
    fileStream.pipe(
      sharp()
        .jpeg()
        .resize(1080, 1080, { fit: sharp.fit.inside })
        .composite([
          { input: watermark, gravity: 'southwest' },
        ])
    ).pipe(response).on('error', (err) => {
      this.logger.error(err);
      response.status(500).send(err);
    });
  }
}
