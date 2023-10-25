import { Test, TestingModule } from '@nestjs/testing';
import { SubCatController } from './sub-cat.controller';
import { SubCatService } from './sub-cat.service';

describe('SubCatController', () => {
  let controller: SubCatController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubCatController],
      providers: [SubCatService],
    }).compile();

    controller = module.get<SubCatController>(SubCatController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
