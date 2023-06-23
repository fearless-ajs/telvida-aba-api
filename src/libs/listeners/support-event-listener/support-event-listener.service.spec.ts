import { Test, TestingModule } from '@nestjs/testing';
import { SupportEventListenerService } from './support-event-listener.service';

describe('SupportEventListenerService', () => {
  let service: SupportEventListenerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SupportEventListenerService],
    }).compile();

    service = module.get<SupportEventListenerService>(SupportEventListenerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
