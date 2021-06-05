import { ReadStream } from 'fs';

export interface FileServiceInterface {
  storeImageFromBase64(base64Image: string): Promise<string>;
  delete(fileIdentifier: string): Promise<void>;
  get(fileIdentifier: string): ReadStream;
}
