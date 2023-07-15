import { Test, TestingModule } from '@nestjs/testing';
import { FileResolver } from './file.resolver';
import { FILE_SERVICE } from '../file-service.token';
import { LocalFileService } from '../local-file/local-file.service';
import { ConfigService } from '@nestjs/config';
import { ImageFileService } from '../image-file/image-file.service';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { File } from '../../dal/entity/file.entity';
import { EntityRepository } from '@mikro-orm/core';

describe('FileResolver', () => {
  let resolver: FileResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: FILE_SERVICE,
          useClass: LocalFileService,
        },
        ConfigService,
        ImageFileService,
        FileResolver,
        {
          provide: getRepositoryToken(File),
          useClass: EntityRepository,
        },
      ],
    }).compile();

    resolver = module.get<FileResolver>(FileResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
