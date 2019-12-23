import { BlobServiceClient, PublicAccessType } from '@azure/storage-blob';
import uuidv1 from 'uuid/v1';
import { isNullOrUndefined } from 'util';

export async function storePublicImageFromBase64(
  base64Image: string,
): Promise<string> {
  const blobServiceClient = await BlobServiceClient.fromConnectionString(
    getStorageConnectionString(),
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

  const uploadBlobResponse = await blockBlobClient.upload(buf, buf.byteLength);
  console.log(
    'Blob was uploaded successfully. requestId: ',
    uploadBlobResponse.requestId,
  );

  const url = blobServiceClient.url + containerName + '/' + blobName;
  // console.log("URL: " + blobServiceClient.url + "/" + containerName + "/" + blob.name);
  return url;
}

export async function deletePublicImageFromUrl(url: string): Promise<void> {
  //FIXME this section should not be duplicated, needs to be DRY
  const blobServiceClient = await BlobServiceClient.fromConnectionString(
    getStorageConnectionString(),
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

export const getStorageConnectionString = () => {
  if (
    isNullOrUndefined(process.env.AzureWebJobsStorage) ||
    process.env.AzureWebJobsStorage === ''
  ) {
    throw Error('Missing process.env.AzureWebJobsStorage');
  }

  return process.env.AzureWebJobsStorage;
};

// export const createStorageContainer = async () => {
// //FIXME example creating a container
// // Create the BlobServiceClient object which will be used to create a container client
// const blobServiceClient = await BlobServiceClient.fromConnectionString(getStorageConnectionString());

// // Create a unique name for the container
// const containerName = 'quickstart' + uuidv1();

// console.log('\nCreating container...');
// console.log('\t', containerName);

// // Get a reference to a container
// const containerClient = await blobServiceClient.getContainerClient(containerName);
// // Create the container
// const createContainerResponse = await containerClient.create();
// console.log("Container was created successfully. requestId: ", createContainerResponse.requestId);

// //FIXME example storing a file
// // Create a unique name for the blob
// const blobName = 'quickstart' + uuidv1() + '.txt';

// // Get a block blob client
// const blockBlobClient = containerClient.getBlockBlobClient(blobName);

// console.log('\nUploading to Azure storage as blob:\n\t', blobName);

// // Upload data to the blob
// const data = 'Hello, World!';
// const uploadBlobResponse = await blockBlobClient.upload(data, data.length);
// console.log("Blob was uploaded successfully. requestId: ", uploadBlobResponse.requestId);

// //FIXME example listing files
// console.log('\nListing blobs...');

// // List the blob(s) in the container.
// for await (const blob of containerClient.listBlobsFlat()) {
//     console.log('\t', blob.name);
//     console.log(blob.metadata);
//     console.log(blob.properties);
//     console.log(blob.snapshot);
//     console.log(blob.deleted);
//     console.log("URL: " + blobServiceClient.url + "/" + containerName + "/" + blob.name);
//     //https://lazztechhubdev.blob.core.windows.net/quickstart57424e00-207f-11ea-be84-215ad6df002d/quickstart577b1140-207f-11ea-be84-215ad6df002d.txt
//     //https://lazztechhubdev.blob.core.windows.net/quickstart57424e00-207f-11ea-be84-215ad6df002d/quickstart577b1140-207f-11ea-be84-215ad6df002d.txt
//     // var url = blobServiceClient.url(containerName, blob.name, null, hostName);
// }

// //FIXME example downloading the files
// // Get blob content from position 0 to the end
// // In Node.js, get downloaded data by accessing downloadBlockBlobResponse.readableStreamBody
// // In browsers, get downloaded data by accessing downloadBlockBlobResponse.blobBody
// const downloadBlockBlobResponse = await blockBlobClient.download(0);
// console.log('\nDownloaded blob content...');
// console.log('\t', await streamToString(downloadBlockBlobResponse.readableStreamBody));

// //FIXME example of deleting a container
// // console.log('\nDeleting container...');

// // // Delete container
// // const deleteContainerResponse = await containerClient.delete();
// // console.log("Container was deleted successfully. requestId: ", deleteContainerResponse.requestId);
// }

//FIXME example function from docs
// A helper function used to read a Node.js readable stream into a string
async function streamToString(readableStream) {
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
