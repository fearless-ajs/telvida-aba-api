import { Test, TestingModule } from '@nestjs/testing';
import { FriendshipInvitationEventListenerService } from './friendship-invitation-event-listener.service';

describe('FriendshipInvitationEventListenerService', () => {
  let service: FriendshipInvitationEventListenerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FriendshipInvitationEventListenerService],
    }).compile();

    service = module.get<FriendshipInvitationEventListenerService>(FriendshipInvitationEventListenerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
