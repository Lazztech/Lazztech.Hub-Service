import { Injectable, Logger } from '@nestjs/common';
import sharp from 'sharp';
import * as imagemin from 'imagemin';
import mozjpeg from 'imagemin-mozjpeg';

@Injectable()
export class ImageFileService {
  private logger = new Logger(ImageFileService.name);

  public convertToJpeg(input: Buffer) {
    return sharp(input).jpeg().toBuffer();
  }

  public async compress(input: Buffer) {
    this.logger.debug(this.compress.name);
    return await imagemin.buffer(input, {
      plugins: [this.convertToJpeg, mozjpeg({ quality: 70 })],
    });
  }
}
