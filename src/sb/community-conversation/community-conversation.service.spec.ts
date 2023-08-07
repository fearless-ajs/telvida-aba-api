import { Test, TestingModule } from '@nestjs/testing';
import { CommunityConversationService } from './community-conversation.service';

describe('CommunityConversationService', () => {
  let service: CommunityConversationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommunityConversationService],
    }).compile();

    service = module.get<CommunityConversationService>(CommunityConversationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
