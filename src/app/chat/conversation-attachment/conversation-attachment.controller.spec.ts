import { Test, TestingModule } from '@nestjs/testing';
import { ConversationAttachmentController } from './conversation-attachment.controller';
import { ConversationAttachmentService } from './conversation-attachment.service';

describe('ConversationAttachmentController', () => {
  let controller: ConversationAttachmentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConversationAttachmentController],
      providers: [ConversationAttachmentService],
    }).compile();

    controller = module.get<ConversationAttachmentController>(ConversationAttachmentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
