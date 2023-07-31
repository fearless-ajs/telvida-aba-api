import { Test, TestingModule } from '@nestjs/testing';
import { ConversationAttachmentService } from './conversation-attachment.service';

describe('ConversationAttachmentService', () => {
  let service: ConversationAttachmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConversationAttachmentService],
    }).compile();

    service = module.get<ConversationAttachmentService>(ConversationAttachmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
