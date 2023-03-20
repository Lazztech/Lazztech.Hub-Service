import { ReadStream } from 'fs';
import { FileUpload } from './file-upload.interface';

export interface FileServiceInterface {
  /**
   * @param file FileUpload with readableStream & supporting information on the upload
   * @returns imageFileName as it's stored from the upload
   */
  storeImageFromFileUpload(file: Promise<FileUpload> | FileUpload): Promise<string>;
  delete(fileName: string): Promise<void>;
  get(fileName: string): ReadStream;
}
