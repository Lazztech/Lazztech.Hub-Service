export interface FileServiceInterface {
  storeImageFromBase64(base64Image: string): Promise<string>;
  deleteImageFromUrl(fileIdentifier: string): Promise<void>;
}
