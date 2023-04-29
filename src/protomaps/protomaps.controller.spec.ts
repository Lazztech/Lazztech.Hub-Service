import { Test, TestingModule } from '@nestjs/testing';
import { ProtomapsController } from './protomaps.controller';

describe('ProtomapsController', () => {
  let controller: ProtomapsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProtomapsController],
    }).compile();

    controller = module.get<ProtomapsController>(ProtomapsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
