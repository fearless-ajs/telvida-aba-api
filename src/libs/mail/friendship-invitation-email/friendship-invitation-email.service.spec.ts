import { Test, TestingModule } from '@nestjs/testing';
import { FriendshipInvitationEmailService } from './friendship-invitation-email.service';

describe('FriendshipInvitationEmailService', () => {
  let service: FriendshipInvitationEmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FriendshipInvitationEmailService],
    }).compile();

    service = module.get<FriendshipInvitationEmailService>(FriendshipInvitationEmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
