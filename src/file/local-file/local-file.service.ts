import { HttpException, HttpStatus, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import uuidv1 from 'uuid/v1';
import { FileServiceInterface } from '../interfaces/file-service.interface';
import { ImageFileService } from '../image-file/image-file.service';
import * as fs from 'fs';
import * as path from 'path';
import { FileUpload } from '../interfaces/file-upload.interface';
import sharp from 'sharp';
import { Stream } from 'stream';

@Injectable()
export class LocalFileService implements FileServiceInterface {
  private logger = new Logger(LocalFileService.name);
  private directory: string = this.configService.get(
    'FILE_STORAGE_DIR',
    path.join('data', 'uploads'),
  );

  constructor(
    private readonly configService: ConfigService,
    private readonly imageFileService: ImageFileService,
  ) {
    this.logger.debug('constructor');
    this.setupDir();
  }

  async storeImageFromBase64(base64Image: string): Promise<string> {
    this.logger.debug(this.storeImageFromBase64.name);
    const data = base64Image.split('base64,')[1];
    let buf = Buffer.from(data, 'base64');
    buf = await this.imageFileService.compress(buf);
    const objectName = uuidv1() + '.jpg';
    await this.saveFile(objectName, buf);
    return objectName;
  }

  async storeImageFromFileUpload(file: FileUpload | Promise<FileUpload>): Promise<string> {
    const { createReadStream, mimetype } = await file;
    if (!mimetype?.startsWith('image/')) {
      throw new HttpException('Wrong filetype', HttpStatus.BAD_REQUEST);
    }

    const fileName = uuidv1() + '.webp';
    const transformer = sharp()
      .webp({ quality: 100 })
      .resize(1080, 1080, { fit: sharp.fit.inside });
    await this.saveFile(fileName, createReadStream().pipe(transformer));
    return fileName;
  }

  get(fileName: string): fs.ReadStream {
    if (fs.existsSync(path.join(this.directory, fileName))) {
      return fs.createReadStream(path.join(this.directory, fileName));
    } else {
      throw new NotFoundException(fileName);
    }
  }

  async delete(fileName: string): Promise<void> {
    return fs.promises.unlink(path.join(this.directory, fileName))
      .catch(err => this.logger.warn(err));
  }

  private saveFile(fileName: string, data: Buffer | string | Stream): Promise<void> {
    return fs.promises.writeFile(path.join(this.directory, fileName), data);
  }

  setupDir() {
    if (!fs.existsSync(this.directory)) {
      this.logger.debug('creating uploads directory');
      fs.mkdirSync(this.directory, { recursive: true });
    }
    this.logger.debug('uploads directory exists');
  }

  private deleteFile(fileName: string): Promise<void> {
    return fs.promises.unlink(path.join(this.directory, fileName));
  }
}
