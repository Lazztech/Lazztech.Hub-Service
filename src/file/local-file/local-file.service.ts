import { HttpException, HttpStatus, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v1 as uuidv1 } from 'uuid';
import { FileServiceInterface } from '../interfaces/file-service.interface';
import { ImageFileService } from '../image-file/image-file.service';
import * as fs from 'fs';
import * as path from 'path';
import { FileUpload } from '../interfaces/file-upload.interface';
import sharp from 'sharp';
import { Stream } from 'stream';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import { File } from '../../dal/entity/file.entity';

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
    @InjectRepository(File)
    private readonly fileRepository: EntityRepository<File>,
  ) {
    this.logger.debug('constructor');
    this.setupDir();
  }

  async storeImageFromFileUpload(upload: FileUpload | Promise<FileUpload>, userId: any): Promise<File> {
    const { createReadStream, mimetype } = await upload;
    if (!mimetype?.startsWith('image/')) {
      throw new HttpException('Wrong filetype', HttpStatus.BAD_REQUEST);
    }

    const fileName = uuidv1() + '.webp';
    const transformer = sharp()
      .webp({ quality: 100 })
      .resize(1080, 1080, { fit: sharp.fit.inside });
    await this.saveFile(fileName, createReadStream().pipe(transformer));

    // repository.create => save pattern used to so that the @BeforeInsert decorated method
    // will fire generating a uuid for the shareableId
    const file = this.fileRepository.create({
      fileName,
      createdOn: new Date().toISOString(),
      createdBy: userId,
    });
    await this.fileRepository.persistAndFlush(file);
    return file;
  }

  get(fileName: string): fs.ReadStream {
    if (fs.existsSync(path.join(this.directory, fileName))) {
      return fs.createReadStream(path.join(this.directory, fileName));
    } else {
      throw new NotFoundException(fileName);
    }
  }

  async getByShareableId(shareableId: string): Promise<fs.ReadStream> {
    const file = await this.fileRepository.findOneOrFail({ shareableId });
    if (fs.existsSync(path.join(this.directory, file.fileName))) {
      return fs.createReadStream(path.join(this.directory, file.fileName));
    } else {
      throw new NotFoundException(file.fileName);
    }
  }

  async delete(fileName: string): Promise<void> {
    return fs.promises.unlink(path.join(this.directory, fileName))
      .catch(err => this.logger.warn(err));
  }

  public async deleteById(fileId: any, userId: any): Promise<any> {
    const file = await this.fileRepository.findOneOrFail({ id: fileId, createdBy: userId });
    await fs.promises.unlink(path.join(this.directory, file.fileName))
      .catch(err => this.logger.warn(err));
    return this.fileRepository.removeAndFlush(file);
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
