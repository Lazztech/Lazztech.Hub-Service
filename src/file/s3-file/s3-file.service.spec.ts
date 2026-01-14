import { getRepositoryToken } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { S3Module, S3ModuleOptions } from 'nestjs-s3';
import { File } from '../../dal/entity/file.entity';
import { S3FileService } from './s3-file.service';
import { EntityManager } from '@mikro-orm/core';

describe('S3FileService', () => {
  let service: S3FileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        S3Module.forRoot({
          config: {
            accessKeyId: 'minio',
            secretAccessKey: 'password',
            endpoint: 'http://127.0.0.1:9000',
            s3ForcePathStyle: true,
            signatureVersion: 'v4',
          },
        } as S3ModuleOptions),
      ],
      providers: [
        S3FileService, 
        ConfigService,
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

    service = module.get<S3FileService>(S3FileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
