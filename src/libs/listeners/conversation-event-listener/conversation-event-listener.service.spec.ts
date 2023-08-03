import { Test, TestingModule } from '@nestjs/testing';
import { ConversationEventListenerService } from './conversation-event-listener.service';

describe('ConversationEventListenerService', () => {
  let service: ConversationEventListenerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConversationEventListenerService],
    }).compile();

    service = module.get<ConversationEventListenerService>(ConversationEventListenerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
