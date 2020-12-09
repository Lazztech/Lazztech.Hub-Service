
export interface FileServiceInterface {
    storePublicImageFromBase64(base64Image: string): Promise<string>;
    deletePublicImageFromUrl(url: string): Promise<void>;
}
