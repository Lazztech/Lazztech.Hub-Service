import { Injectable, Logger } from '@nestjs/common';
import { InjectS3, S3 } from 'nestjs-s3';
import { FileServiceInterface } from '../file-service.interface';
import { ImageFileService } from '../image-file/image-file.service';
import * as uuidv1 from 'uuid/v1';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3FileService implements FileServiceInterface {
  private logger = new Logger(S3FileService.name, true);
  bucketName = 'publicimages';

  constructor(
    @InjectS3() private readonly s3: S3,
    private readonly imageFileService: ImageFileService,
    private readonly configService: ConfigService,
  ) {}

  public async storePublicImageFromBase64(
    base64Image: string,
  ): Promise<string> {
    this.logger.log(this.storePublicImageFromBase64.name);

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
        ACL: 'public-read',
      })
      .promise();
    this.logger.log(
      'Object was uploaded successfully. ' + uploadObjectResponse.VersionId,
    );

    const url = `https://${this.bucketName}.${this.configService.get(
      'OBJECT_STORAGE_ENDPOINT',
    )}/${objectName}`;
    return url;
  }

  public async deletePublicImageFromUrl(url: string): Promise<void> {
    this.logger.log(this.deletePublicImageFromUrl.name);
    const splitUrl = url.split('/');
    const objectName = splitUrl[splitUrl.length - 1];
    const result = await this.s3
      .deleteObject({
        Bucket: this.bucketName,
        Key: objectName,
      })
      .promise();
    this.logger.log(`Deleted image with result: ${result.$response}`);
  }

  private async ensureBucketExists() {
    this.logger.log(this.ensureBucketExists.name);
    const list = await this.s3.listBuckets().promise();
    const bucket = list.Buckets.find((x) => x.Name == this.bucketName);
    if (!bucket) {
      await this.s3.createBucket({ Bucket: this.bucketName }).promise();
    }
  }
}
