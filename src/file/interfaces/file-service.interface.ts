import { ReadStream } from 'fs';

export interface FileServiceInterface {
  storeImageFromBase64(base64Image: string): Promise<string>;
  upload(readStream: ReadStream);
  delete(fileName: string): Promise<void>;
  get(fileName: string): ReadStream;
}
