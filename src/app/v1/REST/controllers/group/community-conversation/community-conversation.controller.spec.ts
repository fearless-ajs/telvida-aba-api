import { Test, TestingModule } from '@nestjs/testing';
import { CommunityConversationController } from './community-conversation.controller';
import { CommunityConversationService } from '../../../../../../sb/community-conversation/community-conversation.service';

describe('CommunityConversationController', () => {
  let controller: CommunityConversationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommunityConversationController],
      providers: [CommunityConversationService],
    }).compile();

    controller = module.get<CommunityConversationController>(CommunityConversationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
