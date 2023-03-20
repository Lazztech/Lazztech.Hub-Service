import { EntityRepository } from '@mikro-orm/core';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { File } from '../../dal/entity/file.entity';
import { ImageFileService } from '../image-file/image-file.service';
import { LocalFileService } from './local-file.service';

describe('LocalFileService', () => {
  let service: LocalFileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigService, 
        ImageFileService, 
        LocalFileService,
        {
          provide: getRepositoryToken(File),
          useClass: EntityRepository,
        },
      ],
    }).compile();

    service = module.get<LocalFileService>(LocalFileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
