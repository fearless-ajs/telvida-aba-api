import { Test, TestingModule } from '@nestjs/testing';
import { FriendshipInvitationService } from './friendship-invitation.service';

describe('FriendshipInvitationService', () => {
  let service: FriendshipInvitationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FriendshipInvitationService],
    }).compile();

    service = module.get<FriendshipInvitationService>(FriendshipInvitationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
