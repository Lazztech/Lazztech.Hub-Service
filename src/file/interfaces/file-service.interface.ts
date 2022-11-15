import { ReadStream } from 'fs';
import { FileUpload } from './file-upload.interface';

export interface FileServiceInterface {
  /**
   * @param base64Image base64 encoded string representation of the image
   * @returns imageFileName as it's stored from the upload
   */
  storeImageFromBase64(base64Image: string): Promise<string>;
  /**
   * @param file FileUpload with readableStream & supporting information on the upload
   * @returns imageFileName as it's stored from the upload
   */
  storeImageFromFileUpload(file: Promise<FileUpload> | FileUpload): Promise<string>;
  delete(fileName: string): Promise<void>;
  get(fileName: string): ReadStream;
}
