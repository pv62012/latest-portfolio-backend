import { Test, TestingModule } from '@nestjs/testing';
import { SubCatService } from './sub-cat.service';

describe('SubCatService', () => {
  let service: SubCatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubCatService],
    }).compile();

    service = module.get<SubCatService>(SubCatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
