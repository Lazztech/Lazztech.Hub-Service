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

@Injectable()
export class S3FileService implements FileServiceInterface {
  private logger = new Logger(S3FileService.name);
  private bucketName = this.configService.get('OBJECT_STORAGE_BUCKET_NAME');

  constructor(
    @InjectS3() private readonly s3: S3,
    private readonly imageFileService: ImageFileService,
    private readonly configService: ConfigService,
  ) {}

  public async storeImageFromBase64(base64Image: string): Promise<string> {
    this.logger.debug(this.storeImageFromBase64.name);

    await this.ensureBucketExists();

    const data = base64Image.split('base64,')[1];
    let buf = Buffer.from(data, 'base64');
    buf = await this.imageFileService.compress(buf);

    const objectName = uuidv1() + '.jpg';

    const uploadObjectResponse = await this.s3
      .putObject({
        Bucket: this.bucketName,
        Key: objectName,
        Body: buf,
      })
      .promise();
    this.logger.debug(
      'Object was uploaded successfully. ' + uploadObjectResponse.VersionId,
    );
    return objectName;
  }

  public async storeImageFromFileUpload(file: Promise<FileUpload> | FileUpload): Promise<string> {
    const { createReadStream, filename, encoding, mimetype } = await file;
    
    return new Promise(async (resolve) => {
      if (!mimetype?.startsWith('image/')) {
        throw new HttpException('Wrong filetype', HttpStatus.BAD_REQUEST);
      }

      const objectName = uuidv1() + '.webp';
  
      const transformer = sharp()
        .webp({ quality: 80 });

      const uploadStream = this.uploadStream(objectName);
      
      createReadStream()
        .pipe(transformer)
        .pipe(uploadStream.writeStream)
        .on('error', () => {
          new HttpException('Could not save image', HttpStatus.BAD_REQUEST);
        });
      
      // await completion of upload
      await uploadStream.promise.then(() => resolve(objectName));
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

  private async ensureBucketExists() {
    this.logger.debug(this.ensureBucketExists.name);
    const list = await this.s3.listBuckets().promise();
    const bucket = list.Buckets.find((x) => x.Name == this.bucketName);
    if (!bucket) {
      await this.s3.createBucket({ Bucket: this.bucketName }).promise();
    }
  }
}
