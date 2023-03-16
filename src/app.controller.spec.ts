import { EntityRepository } from '@mikro-orm/core';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import { Hub } from '@sentry/node';
import { AppController } from './app.controller';
import { Event } from './dal/entity/event.entity';
import { FileUpload } from './dal/entity/fileUpload.entity';
import { JoinUserHub } from './dal/entity/joinUserHub.entity';
import { User } from './dal/entity/user.entity';

describe('AppController', () => {
  let controller: AppController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: getRepositoryToken(User),
          useClass: EntityRepository,
        },
        {
          provide: getRepositoryToken(Hub),
          useClass: EntityRepository,
        },
        {
          provide: getRepositoryToken(JoinUserHub),
          useClass: EntityRepository,
        },
        {
          provide: getRepositoryToken(FileUpload),
          useClass: EntityRepository,
        },
        {
          provide: getRepositoryToken(Event),
          useClass: EntityRepository,
        },
      ]
    }).compile();

    controller = module.get<AppController>(AppController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
