import { FactoryProvider, Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileController } from './file.controller';
import { ImageFileService } from './image-file/image-file.service';
import { LocalFileService } from './local-file/local-file.service';
import { S3FileService } from './s3-file/s3-file.service';

export const fileServiceToken = 'FileService';
export const fileServiceFactory = {
  provide: fileServiceToken,
  useFactory: (
    configService: ConfigService,
    localFileService: LocalFileService,
    s3FileService: S3FileService,
  ) => {
    const fileServiceType = configService.get('FILE_STORAGE_TYPE');
    switch (fileServiceType) {
      case '':
        FileModule.logger.log(
          `Using local file storage: ${process.cwd()}/data`,
        );
        return localFileService;
      case 'local':
        FileModule.logger.log(
          `Using local file storage: ${process.cwd()}/data`,
        );
        return localFileService;
      case 'object':
        FileModule.logger.log(`Using s3 file storage.`);
        return s3FileService;
      default:
        throw new Error('File storage type must be either local, or object.');
    }
  },
  inject: [ConfigService, LocalFileService, S3FileService],
} as FactoryProvider;
@Module({
  controllers: [FileController],
  providers: [
    fileServiceFactory,
    S3FileService,
    LocalFileService,
    ImageFileService,
  ],
  exports: [fileServiceToken],
})
export class FileModule {
  public static logger = new Logger(FileModule.name, true);
}
