import {BlobServiceClient} from '@azure/storage-blob';
import {config} from 'dotenv';

config();

export class AzureBlobService {
  private static _instance: AzureBlobService;
  private readonly azureService;

  private constructor() {
    this.azureService = BlobServiceClient.fromConnectionString(
      process.env.AZURE_BLOB_STORAGE_CONNECTION_STRING as string
    );
  }

  public static getInstance(): AzureBlobService {
    if (!AzureBlobService._instance)
      AzureBlobService._instance = new AzureBlobService();
    return AzureBlobService._instance;
  }

  public deleteFile = async (userId: string, fileName: string) => {
    const containerName = userId;
    const containerClient = this.azureService.getContainerClient(containerName);
    const blobClient = containerClient.getBlobClient(fileName);
    if (await blobClient.exists()) {
      await blobClient.delete();
    }
    return `file ${fileName} was successfully delete from storage!`;
  };

  public downloadFile = async (
    userId: string,
    fileName: string
  ): Promise<NodeJS.ReadableStream> => {
    const containerName = userId;
    const containerClient = this.azureService.getContainerClient(containerName);
    const blobClient = containerClient.getBlobClient(fileName);
    const downloadedBlockBlobResponse = await blobClient.download();
    return downloadedBlockBlobResponse.readableStreamBody;
  };

  public uploadFile = async (
    userId: string,
    buffer: Buffer,
    fileName: string
  ): Promise<string> => {
    const containerName = userId;
    const containerClient = this.azureService.getContainerClient(containerName);

    if (!(await containerClient.exists())) {
      await this.createContainer(containerName);
    }

    const blockBlobClient = containerClient.getBlockBlobClient(fileName);

    if (await blockBlobClient.exists()) {
      throw new Error(
        `for container: ${containerName}, the blob: ${fileName} already exists!`
      );
    }

    await blockBlobClient.upload(buffer, buffer.length);
    return `file ${fileName} was successfully uploaded to storage!`;
  };

  private createContainer = async (name: string) => {
    const containerClient = this.azureService.getContainerClient(name);
    return await containerClient.create().requestId;
  };
}
