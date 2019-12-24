import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isNullOrUndefined } from 'util';
import { BlobServiceClient, PublicAccessType } from '@azure/storage-blob';
import * as uuidv1 from 'uuid/v1';

@Injectable()
export class FileService {
  constructor(private readonly configService: ConfigService) {}

  async storePublicImageFromBase64(base64Image: string): Promise<string> {
    const blobServiceClient = await BlobServiceClient.fromConnectionString(
      this.getStorageConnectionString(),
    );
    const containerName = 'publicimages';
    const containerClient = await blobServiceClient.getContainerClient(
      containerName,
    );
    const exists = await containerClient.exists();
    if (!exists) {
      const createContainerResponse = await containerClient.create();
      const x = await containerClient.getAccessPolicy();
      await containerClient.setAccessPolicy('container');
      //FIXME remove this
      const y = await containerClient.getAccessPolicy();
    }

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
    console.log(
      'Blob was uploaded successfully. requestId: ',
      uploadBlobResponse.requestId,
    );

    const url = blobServiceClient.url + containerName + '/' + blobName;
    // console.log("URL: " + blobServiceClient.url + "/" + containerName + "/" + blob.name);
    return url;
  }

  async deletePublicImageFromUrl(url: string): Promise<void> {
    //FIXME this section should not be duplicated, needs to be DRY
    const blobServiceClient = await BlobServiceClient.fromConnectionString(
      this.getStorageConnectionString(),
    );
    const containerName = 'publicimages';
    const containerClient = await blobServiceClient.getContainerClient(
      containerName,
    );
    const exists = await containerClient.exists();
    if (!exists) {
      const createContainerResponse = await containerClient.create();
      const x = await containerClient.getAccessPolicy();
      await containerClient.setAccessPolicy('container');
      //FIXME remove this
      const y = await containerClient.getAccessPolicy();
    }

    //Get last string after last '/'
    const blobName = url.split('/').length[url.split('/').length - 1];
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    const blobExists = await blockBlobClient.exists();
    if (blobExists) {
      const response = await containerClient.delete();
    }
  }

  getStorageConnectionString() {
    const storageString = this.configService.get<string>('AzureWebJobsStorage');

    if (
      isNullOrUndefined(storageString) ||
      storageString === ''
    ) {
      throw Error('Missing process.env.AzureWebJobsStorage');
    }

    return storageString;
  }

  //FIXME example function from docs
  // A helper function used to read a Node.js readable stream into a string
  private async streamToString(readableStream) {
    return new Promise((resolve, reject) => {
      const chunks = [];
      readableStream.on('data', data => {
        chunks.push(data.toString());
      });
      readableStream.on('end', () => {
        resolve(chunks.join(''));
      });
      readableStream.on('error', reject);
    });
  }
}
