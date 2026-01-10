import { Test, TestingModule } from '@nestjs/testing';
import { FileResolver } from './file.resolver';
import { LocalFileService } from '../local-file/local-file.service';
import { ConfigService } from '@nestjs/config';
import { ImageFileService } from '../image-file/image-file.service';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { File } from '../../dal/entity/file.entity';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { FileService } from '../file-service.abstract';
import fs from 'fs';

jest.mock('fs');

describe('FileResolver', () => {
  let resolver: FileResolver;

  beforeEach(async () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    (fs.mkdirSync as jest.Mock).mockImplementation(() => {});
    const module: TestingModule = await Test.createTestingModule({
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
        FileResolver,
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

    resolver = module.get<FileResolver>(FileResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
