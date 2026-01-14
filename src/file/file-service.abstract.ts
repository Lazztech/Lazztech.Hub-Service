import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import sharp from 'sharp';
import { File } from 'src/dal/entity/file.entity';
import Stream, { Readable } from 'stream';
import { FileServiceInterface } from './interfaces/file-service.interface';
import { FileUpload } from './interfaces/file-upload.interface';

@Injectable()
export abstract class FileService implements FileServiceInterface {
  public logger = new Logger(FileService.name);

  public watermark: Promise<Buffer<ArrayBufferLike>>;

  constructor(readonly configService: ConfigService) {}

  abstract storeImageFromFileUpload(
    upload: Promise<FileUpload> | FileUpload,
    userId: any,
  ): Promise<File>;
  abstract delete(fileName: string): Promise<void>;
  abstract deleteById(fileId: any, userId: any): Promise<any>;
  abstract get(fileName: string): Promise<Readable>;
  abstract getByShareableId(shareableId: string): Promise<Readable>;

  async getWatermark() {
    return sharp(
      join(
        process.cwd(),
        'public',
        'assets',
        this.configService.getOrThrow('ICON_NAME'),
      ),
    )
      .resize(150, 150)
      .extend({
        top: 0,
        bottom: 20,
        left: 20,
        right: 0,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
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
        },
      ])
      .toBuffer();
  }

  async watermarkImage(
    fileStream: Stream.Readable | undefined,
  ): Promise<Readable | undefined> {
    const watermark = await this.getWatermark();
    return fileStream?.pipe(
      sharp()
        .jpeg()
        .resize(1080, 1080, { fit: sharp.fit.inside })
        .composite([{ input: watermark, gravity: 'southwest' }]),
    );
  }
}
