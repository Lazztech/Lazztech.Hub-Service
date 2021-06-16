import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { ImageFileService } from '../image-file/image-file.service';
import { LocalFileService } from './local-file.service';

describe('LocalFileService', () => {
  let service: LocalFileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfigService, ImageFileService, LocalFileService],
    }).compile();

    service = module.get<LocalFileService>(LocalFileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
