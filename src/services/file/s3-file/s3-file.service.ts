import { Injectable } from '@nestjs/common';
import { IFileService } from '../file.interface';

@Injectable()
export class S3FileService implements IFileService {


    storePublicImageFromBase64(base64Image: string): Promise<string> {
        throw new Error('Method not implemented.');
    }
    
    deletePublicImageFromUrl(url: string): Promise<void> {
        throw new Error('Method not implemented.');
    }

}
