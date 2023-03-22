import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectS3, S3 } from 'nestjs-s3';
import { FileServiceInterface } from '../interfaces/file-service.interface';
import { ImageFileService } from '../image-file/image-file.service';
import uuidv1 from 'uuid/v1';
import { ConfigService } from '@nestjs/config';
import { ReadStream } from 'fs';
import { FileUpload } from '../interfaces/file-upload.interface';
import sharp from 'sharp';
import { Stream } from 'stream';
import { InjectRepository } from '@mikro-orm/nestjs';
import { File } from '../../dal/entity/file.entity';
import { EntityRepository } from '@mikro-orm/core';

@Injectable()
export class S3FileService implements FileServiceInterface {
  private logger = new Logger(S3FileService.name);
  private bucketName = this.configService.get('OBJECT_STORAGE_BUCKET_NAME');

  constructor(
    @InjectS3() private readonly s3: S3,
    private readonly imageFileService: ImageFileService,
    private readonly configService: ConfigService,
    @InjectRepository(File)
    private readonly fileRepository: EntityRepository<File>,
  ) {}

  public async storeImageFromFileUpload(upload: Promise<FileUpload> | FileUpload, userId: any): Promise<File> {
    const { createReadStream, mimetype } = await upload;
    console.log(upload)
    return new Promise(async (resolve) => {
      if (!mimetype?.startsWith('image/')) {
        throw new HttpException('Wrong filetype', HttpStatus.BAD_REQUEST);
      }

      const fileName = uuidv1() + '.webp';
  
      const transformer = sharp()
        .webp({ quality: 100 })
        .resize(1080, 1080, { fit: sharp.fit.inside });

      const uploadStream = this.uploadStream(fileName);
      
      createReadStream()
        .pipe(transformer)
        .pipe(uploadStream.writeStream)
        .on('error', () => {
          new HttpException('Could not save image', HttpStatus.BAD_REQUEST);
        });
      
      // await completion of upload
      await uploadStream.promise.then(async () => {
        // repository.create => save pattern used to so that the @BeforeInsert decorated method
        // will fire generating a uuid for the shareableId
        const file = this.fileRepository.create({
          fileName,
          createdOn: new Date().toISOString(),
          createdBy: userId,
        });
        await this.fileRepository.persistAndFlush(file);
        resolve(file);
      });
    });
  }

  private uploadStream(key: string) {
    const pass = new Stream.PassThrough();
    return {
      writeStream: pass,
      promise: this.s3.upload({ 
        Bucket: this.bucketName, 
        Key: key, 
        Body: pass }).promise(),
    };
  }

  public async delete(url: string): Promise<void> {
    this.logger.debug(this.delete.name);
    const splitUrl = url.split('/');
    const objectName = splitUrl[splitUrl.length - 1];
    const result = await this.s3
      .deleteObject({
        Bucket: this.bucketName,
        Key: objectName,
      })
      .promise();
    this.logger.debug(`Deleted image with result: ${result.$response}`);
  }

  get(fileName: string): ReadStream {
    return this.s3
      .getObject({
        Bucket: this.bucketName,
        Key: fileName,
      })
      .createReadStream() as ReadStream;
  }

  async getByShareableId(shareableId: string): Promise<ReadStream> {
    const file = await this.fileRepository.findOneOrFail({ shareableId });
    return this.s3
      .getObject({
        Bucket: this.bucketName,
        Key: file.fileName,
      })
      .createReadStream() as ReadStream;
  }

  private async ensureBucketExists() {
    this.logger.debug(this.ensureBucketExists.name);
    const list = await this.s3.listBuckets().promise();
    const bucket = list.Buckets.find((x) => x.Name == this.bucketName);
    if (!bucket) {
      await this.s3.createBucket({ Bucket: this.bucketName }).promise();
    }
  }
}
