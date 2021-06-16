import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as uuidv1 from 'uuid/v1';
import { FileServiceInterface } from '../interfaces/file-service.interface';
import { ImageFileService } from '../image-file/image-file.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LocalFileService implements FileServiceInterface {
  private logger = new Logger(LocalFileService.name, true);
  private directory: string = this.configService.get(
    'FILE_STORAGE_DIR',
    path.join('data', 'uploads'),
  );

  constructor(
    private readonly configService: ConfigService,
    private readonly imageFileService: ImageFileService,
  ) {
    this.logger.log('constructor');
    this.setupDir();
  }

  async storeImageFromBase64(base64Image: string): Promise<string> {
    this.logger.log(this.storeImageFromBase64.name);
    const data = base64Image.split('base64,')[1];
    let buf = Buffer.from(data, 'base64');
    buf = await this.imageFileService.compress(buf);
    const objectName = uuidv1() + '.jpg';
    await this.saveFile(objectName, buf);
    return objectName;
  }

  get(fileName: string): fs.ReadStream {
    return fs.createReadStream(`${this.directory}/${fileName}`);
  }

  delete(fileName: string): Promise<void> {
    return fs.promises.unlink(`${this.directory}/${fileName}`);
  }

  private saveFile(fileName: string, data: Buffer | string): Promise<void> {
    return fs.promises.writeFile(`${this.directory}/${fileName}`, data);
  }

  setupDir() {
    if (!fs.existsSync(this.directory)) {
      this.logger.log('creating uploads directory');
      fs.mkdirSync(this.directory, { recursive: true });
    }
    this.logger.log('uploads directory exists');
  }

  private deleteFile(fileName: string): Promise<void> {
    return fs.promises.unlink(`${this.directory}/${fileName}`);
  }
}
