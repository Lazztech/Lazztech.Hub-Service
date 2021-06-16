import { Test, TestingModule } from '@nestjs/testing';
import { ImageFileService } from './image-file.service';

describe('ImageFileService', () => {
  let service: ImageFileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImageFileService],
    }).compile();

    service = module.get<ImageFileService>(ImageFileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
