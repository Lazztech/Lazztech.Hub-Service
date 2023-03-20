import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { FILE_SERVICE } from '../file-service.token';
import { FileController } from './file.controller';
import { ImageFileService } from '../image-file/image-file.service';
import { LocalFileService } from '../local-file/local-file.service';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { File } from '../../dal/entity/file.entity';
import { EntityRepository } from '@mikro-orm/core';

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
        {
          provide: getRepositoryToken(File),
          useClass: EntityRepository,
        },
      ],
    }).compile();

    controller = module.get<FileController>(FileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
