import { Test, TestingModule } from '@nestjs/testing';
import { OneToOneChatGateway } from './one-to-one-chat.gateway';
import { OneToOneChatService } from '../../services/chat/one-to-one-chat.service';

describe('OneToOneChatGateway', () => {
  let gateway: OneToOneChatGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OneToOneChatGateway, OneToOneChatService],
    }).compile();

    gateway = module.get<OneToOneChatGateway>(OneToOneChatGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
