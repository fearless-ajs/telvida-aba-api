import { Test, TestingModule } from '@nestjs/testing';
import { CommunityRequestService } from './community-request.service';

describe('CommunityRequestService', () => {
  let service: CommunityRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommunityRequestService],
    }).compile();

    service = module.get<CommunityRequestService>(CommunityRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
