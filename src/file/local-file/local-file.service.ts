import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as uuidv1 from 'uuid/v1';
import { FileServiceInterface } from '../file-service.interface';
import { ImageFileService } from '../image-file/image-file.service';
import fs, { ReadStream } from 'fs';

@Injectable()
export class LocalFileService implements FileServiceInterface {
  private logger = new Logger(LocalFileService.name, true);
  private directory: string = this.configService.get(
    'FILE_STORAGE_DIR',
    'data',
  );

  constructor(
    private readonly configService: ConfigService,
    private readonly imageFileService: ImageFileService,
  ) {
    this.logger.log('constructor');
  }

  async storeImageFromBase64(base64Image: string): Promise<string> {
    const data = base64Image.split('base64,')[1];
    let buf = Buffer.from(data, 'base64');
    buf = await this.imageFileService.compress(buf);
    const objectName = uuidv1() + '.jpg';

    throw new Error('Method not implemented.');
  }

  get(fileIdentifier: string): ReadStream {
    return fs.createReadStream(`${this.directory}/${fileIdentifier}`);
  }

  delete(fileIdentifier: string): Promise<void> {
    return fs.promises.unlink(`${this.directory}/${fileIdentifier}`);
  }

  private saveFile(fileName: string) {
    throw new Error('Method not implemented.');
  }

  private deleteFile(fileName: string): Promise<void> {
    return fs.promises.unlink(`${this.directory}/${fileName}`);
  }
}
