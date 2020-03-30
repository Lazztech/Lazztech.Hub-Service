import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isNullOrUndefined } from 'util';
import { BlobServiceClient, PublicAccessType } from '@azure/storage-blob';
import * as uuidv1 from 'uuid/v1';

@Injectable()
export class FileService {
  private logger = new Logger(FileService.name, true);
  containerName = 'publicimages';

  constructor(private readonly configService: ConfigService) {
    this.logger.log('constructor');
  }

  async storePublicImageFromBase64(base64Image: string): Promise<string> {
    this.logger.log(this.storePublicImageFromBase64.name);

    const blobServiceClient = await BlobServiceClient.fromConnectionString(
      this.getStorageConnectionString(),
    );
    const containerClient = await this.getPublicContainerClient(blobServiceClient);
    await this.ensureContainerExists(containerClient);

    const mimeType = base64Image.split(';')[0];
    const extension = '.' + mimeType.split('/')[1];
    const blobName = uuidv1() + extension;

    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    const data = base64Image.split('base64,')[1];
    const buf = Buffer.from(data, 'base64');

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
    const exists = await containerClient.exists();
    if (!exists) {
      await this.createContainer(containerClient);
    }
  }

  private async createContainer(containerClient) {
    const createContainerResponse = await containerClient.create();
    const x = await containerClient.getAccessPolicy();
    await containerClient.setAccessPolicy('container');
  }

  async deletePublicImageFromUrl(url: string): Promise<void> {
    this.logger.log(this.deletePublicImageFromUrl.name);
    //FIXME Ensure any images that are no longer needed get deleted, for a hub that's been deleted for example!
    const blobServiceClient = await BlobServiceClient.fromConnectionString(
      this.getStorageConnectionString(),
    );
    const containerClient = await this.getPublicContainerClient(blobServiceClient);
    await this.ensureContainerExists(containerClient);

    //Get last string after last '/'
    const blobName = url.split('/').length[url.split('/').length - 1];
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    const blobExists = await blockBlobClient.exists();
    if (blobExists) {
      const response = await containerClient.delete();
    }
  }
  
  async getPublicContainerClient(blobServiceClient: BlobServiceClient) {
    const containerClient = await blobServiceClient.getContainerClient(
      this.containerName,
    );
    return containerClient;
  }

  getStorageConnectionString() {
    this.logger.log(this.getStorageConnectionString.name);
    const storageString = this.configService.get<string>('AzureWebJobsStorage');
    if (isNullOrUndefined(storageString) || storageString === '') {
      throw Error('Missing process.env.AzureWebJobsStorage');
    }
    return storageString;
  }

}
