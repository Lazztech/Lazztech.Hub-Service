import { BlobServiceClient } from '@azure/storage-blob';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isNullOrUndefined } from 'util';
import * as uuidv1 from 'uuid/v1';
import { IFileService } from './file.interface';
import { ImageFileService } from './image-file/image-file.service';

@Injectable()
export class FileService implements IFileService {
  private logger = new Logger(FileService.name, true);
  containerName = 'publicimages';

  constructor(
    private readonly configService: ConfigService,
    private readonly imageFileService: ImageFileService,
  ) {
    this.logger.log('constructor');
  }

  public async storePublicImageFromBase64(
    base64Image: string,
  ): Promise<string> {
    this.logger.log(this.storePublicImageFromBase64.name);

    const blobServiceClient = await BlobServiceClient.fromConnectionString(
      this.getStorageConnectionString(),
    );
    const containerClient = await this.getPublicContainerClient(
      blobServiceClient,
    );
    await this.ensureContainerExists(containerClient);

    // const mimeType = base64Image.split(';')[0];
    // const extension = '.' + mimeType.split('/')[1];

    const data = base64Image.split('base64,')[1];
    let buf = Buffer.from(data, 'base64');
    buf = await this.imageFileService.compress(buf);

    const blobName = uuidv1() + '.jpg';
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    const uploadBlobResponse = await blockBlobClient.upload(
      buf,
      buf.byteLength,
    );
    this.logger.log(
      'Blob was uploaded successfully. requestId: ' +
        uploadBlobResponse.requestId,
    );

    const url = blobServiceClient.url + this.containerName + '/' + blobName;
    return url;
  }

  private async ensureContainerExists(containerClient) {
    this.logger.log(this.ensureContainerExists.name);
    const exists = await containerClient.exists();
    if (!exists) {
      await this.createContainer(containerClient);
    }
  }

  private async createContainer(containerClient) {
    this.logger.log(this.createContainer.name);
    const createContainerResponse = await containerClient.create();
    const x = await containerClient.getAccessPolicy();
    await containerClient.setAccessPolicy('container');
  }

  public async deletePublicImageFromUrl(url: string): Promise<void> {
    this.logger.log(this.deletePublicImageFromUrl.name);
    // FIXME Ensure any images that are no longer needed get deleted, for a hub that's been deleted for example!
    const blobServiceClient = await BlobServiceClient.fromConnectionString(
      this.getStorageConnectionString(),
    );
    const containerClient = await this.getPublicContainerClient(
      blobServiceClient,
    );
    await this.ensureContainerExists(containerClient);

    // Get last string after last '/'
    const blobName = url.split('/').length[url.split('/').length - 1];
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    const blobExists = await blockBlobClient.exists();
    if (blobExists) {
      const response = await containerClient.delete();
    }
  }

  private async getPublicContainerClient(blobServiceClient: BlobServiceClient) {
    this.logger.log(this.getPublicContainerClient.name);
    const containerClient = await blobServiceClient.getContainerClient(
      this.containerName,
    );
    return containerClient;
  }

  private getStorageConnectionString() {
    this.logger.log(this.getStorageConnectionString.name);
    this.logger.log(this.getStorageConnectionString.name);
    const storageString = this.configService.get<string>('AzureWebJobsStorage');
    if (isNullOrUndefined(storageString) || storageString === '') {
      throw Error('Missing process.env.AzureWebJobsStorage');
    }
    return storageString;
  }
}
