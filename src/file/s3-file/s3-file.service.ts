import { HttpException, HttpStatus, Injectable} from '@nestjs/common';
import { ImageFileService } from '../image-file/image-file.service';
import { ConfigService } from '@nestjs/config';
import sharp from 'sharp';
import { Readable, Stream } from 'stream';
import { InjectS3, type S3 } from 'nestjs-s3';
import { InjectRepository } from '@mikro-orm/nestjs';
import { File } from '../../dal/entity/file.entity';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { FileService } from '../file-service.abstract';
import { randomUUID } from 'crypto';
import { FileUpload } from '../interfaces/file-upload.interface';

@Injectable()
export class S3FileService extends FileService{
  private bucketName = this.configService.get('OBJECT_STORAGE_BUCKET_NAME');

  constructor(
    @InjectS3() private readonly s3: S3,
    private readonly imageFileService: ImageFileService,
    readonly configService: ConfigService,
    @InjectRepository(File)
    private readonly fileRepository: EntityRepository<File>,
    private readonly em: EntityManager,
  ) {
    super(configService);
  }
  public watermark: Promise<Buffer<ArrayBufferLike>>;
  getWatermark(): Promise<Buffer<ArrayBufferLike>> {
    throw new Error('Method not implemented.');
  }

  public async storeImageFromFileUpload(upload: Promise<FileUpload> | FileUpload, userId: any): Promise<File> {
    const { createReadStream, mimetype } = await upload;
    console.log(upload)
    return new Promise(async (resolve) => {
      if (!mimetype?.startsWith('image/')) {
        throw new HttpException('Wrong filetype', HttpStatus.BAD_REQUEST);
      }

      const fileName = randomUUID() + '.webp';
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
        await this.em.persist(file).flush();
        resolve(file);
      });
    });
  }

  private uploadStream(key: string) {
    const pass = new Stream.PassThrough();
    return {
      writeStream: pass,
      promise: this.s3.putObject({
        Bucket: this.bucketName,
        Key: key,
        Body: pass,
      }),
    };
  }

  public async delete(url: string): Promise<void> {
    this.logger.debug(this.delete.name);
    const splitUrl = url.split('/');
    const objectName = splitUrl[splitUrl.length - 1];
    await this.s3.deleteObject({
      Bucket: this.bucketName,
      Key: objectName,
    });
    this.logger.debug(`Deleted image by url ${url}`);
  }

  public async deleteById(fileId: any, userId: any): Promise<any> {
    const file = await this.fileRepository.findOneOrFail({
      id: fileId,
      createdBy: userId,
    });
    await this.s3.deleteObject({
      Bucket: this.bucketName,
      Key: file.fileName,
    });
    return this.fileRepository.getEntityManager().removeAndFlush(file);
  }

  async get(fileName: string): Promise<Readable> {
    const response = await this.s3.getObject({
      Bucket: this.bucketName,
      Key: fileName,
    });
    
    return response.Body as Readable;
}

  async getByShareableId(shareableId: string): Promise<Readable> {
    const file = await this.fileRepository.findOneOrFail({ shareableId });

    const response = await this.s3.getObject({
      Bucket: this.bucketName,
      Key: file.fileName,
    });
    
    return response.Body as Readable;
  }

  private async ensureBucketExists() {
    this.logger.debug(this.ensureBucketExists.name);
    const list = await this.s3.listBuckets();
    const bucket = list.Buckets.find((x) => x.Name == this.bucketName);
    if (!bucket) {
      await this.s3.createBucket({ Bucket: this.bucketName });
    }
  }
}
