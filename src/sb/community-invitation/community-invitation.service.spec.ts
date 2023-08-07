import { Test, TestingModule } from '@nestjs/testing';
import { CommunityInvitationService } from './community-invitation.service';

describe('CommunityInvitationService', () => {
  let service: CommunityInvitationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommunityInvitationService],
    }).compile();

    service = module.get<CommunityInvitationService>(CommunityInvitationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
