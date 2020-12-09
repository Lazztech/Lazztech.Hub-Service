import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AzureFileService } from './azure-file.service';
import { ImageFileService } from '../image-file/image-file.service';

describe('FileService', () => {
  let service: AzureFileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfigService, ImageFileService, AzureFileService],
    }).compile();

    service = module.get<AzureFileService>(AzureFileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
