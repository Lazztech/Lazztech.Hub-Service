import { FactoryProvider, Module } from '@nestjs/common';
import { EmailService } from './email/email.service';
import { AzureFileService } from './file/azure-file/azure-file.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordReset } from 'src/dal/entity/passwordReset.entity';
import { ImageFileService } from './file/image-file/image-file.service';
import { S3FileService } from './file/s3-file/s3-file.service';
import { ConfigService } from '@nestjs/config';
import { FileServiceInterface } from './file/file-service.interface';

export const fileServiceToken = 'FileService';
export const fileServiceFactory = {
  provide: fileServiceToken,
  useFactory: (
    configService: ConfigService,
    azureFileService: AzureFileService,
    s3FileService: S3FileService,
  ) => {
    const fileServiceType = configService.get('FILE_STORAGE_TYPE');
    let implementation;
    switch (fileServiceType) {
      case 'object':
        implementation = s3FileService;
        break;
      default:
        implementation = azureFileService;
        break;
    }
    return implementation;
  },
  inject: [ConfigService, AzureFileService, S3FileService],
} as FactoryProvider;
@Module({
  imports: [TypeOrmModule.forFeature([PasswordReset])],
  controllers: [],
  providers: [
    fileServiceFactory,
    AzureFileService,
    S3FileService,
    EmailService,
    ImageFileService,
  ],
  exports: [fileServiceToken, EmailService],
})
export class ServicesModule { }
