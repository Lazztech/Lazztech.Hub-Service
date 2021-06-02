import { BlobServiceClient } from '@azure/storage-blob';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isNullOrUndefined } from 'util';
import * as uuidv1 from 'uuid/v1';
import { FileServiceInterface } from '../file-service.interface';
import { ImageFileService } from '../image-file/image-file.service';

@Injectable()
export class LocalFileService implements FileServiceInterface {
  private logger = new Logger(LocalFileService.name, true);

  constructor(
    private readonly configService: ConfigService,
    private readonly imageFileService: ImageFileService,
  ) {
    this.logger.log('constructor');
  }
  storePublicImageFromBase64(base64Image: string): Promise<string> {
    throw new Error('Method not implemented.');
  }
  deletePublicImageFromUrl(url: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
