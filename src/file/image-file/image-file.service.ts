import { Injectable } from '@nestjs/common';
import isJpg from 'is-jpg';
import * as sharp from 'sharp';
import * as imagemin from 'imagemin';
import * as mozjpeg from 'imagemin-mozjpeg';

@Injectable()
export class ImageFileService {
  public isJpeg(input: Buffer) {
    return isJpg(input);
  }

  public convertToJpeg(input: Buffer) {
    return sharp(input).jpeg().toBuffer();
  }

  public async compress(input: Buffer) {
    return await imagemin.buffer(input, {
      plugins: [this.convertToJpeg, mozjpeg({ quality: 70 })],
    });
  }
}
