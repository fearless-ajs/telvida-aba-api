import { Test, TestingModule } from '@nestjs/testing';
import { CommunityConversationAttachmentService } from './community-conversation-attachment.service';

describe('CommunityConversationAttachmentService', () => {
  let service: CommunityConversationAttachmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommunityConversationAttachmentService],
    }).compile();

    service = module.get<CommunityConversationAttachmentService>(CommunityConversationAttachmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
