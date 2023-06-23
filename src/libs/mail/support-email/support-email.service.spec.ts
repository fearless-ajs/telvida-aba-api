import { Test, TestingModule } from '@nestjs/testing';
import { SupportEmailService } from './support-email.service';

describe('SupportEmailService', () => {
  let service: SupportEmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SupportEmailService],
    }).compile();

    service = module.get<SupportEmailService>(SupportEmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
