import { FactoryProvider, Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FILE_SERVICE } from './file-service.token';
import { FileController } from './controller/file.controller';
import { ImageFileService } from './image-file/image-file.service';
import { LocalFileService } from './local-file/local-file.service';
import { S3FileService } from './s3-file/s3-file.service';
import { FileUrlService } from './file-url/file-url.service';
import * as path from 'path';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { File } from '../dal/entity/file.entity';
import { FileResolver } from './resolver/file.resolver';

export const fileServiceFactory = {
  provide: FILE_SERVICE,
  useFactory: (
    configService: ConfigService,
    localFileService: LocalFileService,
    s3FileService: S3FileService,
  ) => {
    const fileServiceType = configService.get('FILE_STORAGE_TYPE', 'local');
    switch (fileServiceType) {
      case 'local':
        FileModule.logger.log(
          `Using local file storage: ${process.cwd()}/${configService.get(
            'FILE_STORAGE_DIR',
            path.join('data', 'uploads'),
          )}`,
        );
        return localFileService;
      case 'object':
        FileModule.logger.log(
          `Using s3 file storage endpoint: ${configService.get(
            'OBJECT_STORAGE_ENDPOINT',
          )}, bucket: ${configService.get('OBJECT_STORAGE_BUCKET_NAME')}`,
        );
        return s3FileService;
      default:
        throw new Error('File storage type must be either local, or object.');
    }
  },
  inject: [ConfigService, LocalFileService, S3FileService],
} as FactoryProvider;
@Module({
  imports: [
    MikroOrmModule.forFeature([
      File,
    ]),
  ],
  controllers: [FileController],
  providers: [
    fileServiceFactory,
    S3FileService,
    LocalFileService,
    ImageFileService,
    FileUrlService,
    FileResolver,
  ],
  exports: [FILE_SERVICE, FileUrlService],
})
export class FileModule {
  public static logger = new Logger(FileModule.name);
}
