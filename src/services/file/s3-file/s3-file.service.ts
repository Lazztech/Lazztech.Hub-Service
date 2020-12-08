import { Injectable, Logger } from '@nestjs/common';
import { InjectS3, S3 } from 'nestjs-s3';
import { IFileService } from '../file.interface';
import { ImageFileService } from '../image-file/image-file.service';
import * as uuidv1 from 'uuid/v1';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3FileService implements IFileService {
    private logger = new Logger(S3FileService.name, true);
    bucketName = 'publicimages';

    constructor(
        @InjectS3() private readonly s3: S3,
        private readonly imageFileService: ImageFileService,
        private readonly configService: ConfigService,
      ) {}

    public async storePublicImageFromBase64(base64Image: string): Promise<string> {
        this.logger.log(this.storePublicImageFromBase64.name);

        await this.ensureBucketExists();

        const data = base64Image.split('base64,')[1];
        let buf = Buffer.from(data, 'base64');
        buf = await this.imageFileService.compress(buf);
    
        const objectName = uuidv1() + '.jpg';

        const uploadObjectResponse = await this.s3.putObject({
            Bucket: this.bucketName,
            Key: objectName,
            Body: buf
        }).promise();
        this.logger.log(
            'Object was uploaded successfully. ' +
            uploadObjectResponse.VersionId
        );

        const url = `${this.configService.get('OBJECT_STORAGE_ENDPOINT')}/${this.bucketName}/${objectName}`;
        return url;
    }

    public deletePublicImageFromUrl(url: string): Promise<void> {
        this.logger.log(this.deletePublicImageFromUrl.name);
        const objectName = url.split('/').length[url.split('/').length - 1];
        // const objectExists = await

        throw new Error('Method not implemented.');
    }

    private async ensureBucketExists() {
        this.logger.log(this.ensureBucketExists.name);
        const list = await this.s3.listBuckets().promise();
        const bucket = list.Buckets.find(x => x.Name == this.bucketName);
        if (!bucket) {
            await this.s3.createBucket({ Bucket: this.bucketName }).promise();
        }
    }

}
