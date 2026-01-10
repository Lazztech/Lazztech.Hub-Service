import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { FileController } from './file.controller';
import { ImageFileService } from '../image-file/image-file.service';
import { LocalFileService } from '../local-file/local-file.service';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { File } from '../../dal/entity/file.entity';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { FileService } from '../file-service.abstract';
import fs from 'fs';

jest.mock('fs');

describe('FileController', () => {
  let controller: FileController;

  beforeEach(async () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    (fs.mkdirSync as jest.Mock).mockImplementation(() => {});
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FileController],
      providers: [
        {
          provide: FileService,
          useClass: LocalFileService,
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(() => ''),
            getOrThrow: jest.fn(() => ''),
          },
        },
        ImageFileService,
        {
          provide: getRepositoryToken(File),
          useClass: EntityRepository,
        },
        {
          provide: EntityManager,
          useValue: {
            persist: jest.fn().mockReturnThis(),
            remove: jest.fn().mockReturnThis(),
            flush: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    controller = module.get<FileController>(FileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
