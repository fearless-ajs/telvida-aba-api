import { Test, TestingModule } from '@nestjs/testing';
import { CommunityRequestController } from './community-request.controller';
import { CommunityRequestService } from '../../../services/group/community-request/community-request.service';

describe('CommunityRequestController', () => {
  let controller: CommunityRequestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommunityRequestController],
      providers: [CommunityRequestService],
    }).compile();

    controller = module.get<CommunityRequestController>(CommunityRequestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
