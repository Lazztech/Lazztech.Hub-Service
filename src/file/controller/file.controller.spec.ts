import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { FILE_SERVICE } from '../file-service.token';
import { FileController } from './file.controller';
import { ImageFileService } from '../image-file/image-file.service';
import { LocalFileService } from '../local-file/local-file.service';

describe('FileController', () => {
  let controller: FileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FileController],
      providers: [
        {
          provide: FILE_SERVICE,
          useClass: LocalFileService,
        },
        ConfigService,
        ImageFileService,
      ],
    }).compile();

    controller = module.get<FileController>(FileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
