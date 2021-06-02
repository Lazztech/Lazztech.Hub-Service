import { FactoryProvider, Logger, Module } from '@nestjs/common';
import { EmailService } from './email/email.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordReset } from '../dal/entity/passwordReset.entity';
import { ImageFileService } from './file/image-file/image-file.service';
import { S3FileService } from './file/s3-file/s3-file.service';
import { ConfigService } from '@nestjs/config';
import { AppModule } from '../app.module';
import { LocalFileService } from './file/local-file/local-file.service';

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
        AppModule.logger.log(`Using local file storage: ${process.cwd()}/data`);
        return localFileService;
      case 'local':
        AppModule.logger.log(`Using local file storage: ${process.cwd()}/data`);
        return localFileService;
      case 'object':
        AppModule.logger.log(`Using s3 file storage.`);
        return s3FileService;
      default:
        throw new Error('File storage type must be either local, or object.');
    }
  },
  inject: [ConfigService, LocalFileService, S3FileService],
} as FactoryProvider;
@Module({
  imports: [TypeOrmModule.forFeature([PasswordReset])],
  controllers: [],
  providers: [
    fileServiceFactory,
    S3FileService,
    LocalFileService,
    EmailService,
    ImageFileService,
  ],
  exports: [fileServiceToken, EmailService],
})
export class ServicesModule {
  public static logger = new Logger(ServicesModule.name, true);
}
