import { Test, TestingModule } from '@nestjs/testing';
import { CommunityConversationAttachmentController } from './community-conversation-attachment.controller';
import { CommunityConversationAttachmentService } from '../../../services/group/community-conversation-attachment/community-conversation-attachment.service';

describe('CommunityConversationAttachmentController', () => {
  let controller: CommunityConversationAttachmentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommunityConversationAttachmentController],
      providers: [CommunityConversationAttachmentService],
    }).compile();

    controller = module.get<CommunityConversationAttachmentController>(CommunityConversationAttachmentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
