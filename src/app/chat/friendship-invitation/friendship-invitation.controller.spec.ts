import { Test, TestingModule } from '@nestjs/testing';
import { FriendshipInvitationController } from './friendship-invitation.controller';
import { FriendshipInvitationService } from './friendship-invitation.service';

describe('FriendshipInvitationController', () => {
  let controller: FriendshipInvitationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FriendshipInvitationController],
      providers: [FriendshipInvitationService],
    }).compile();

    controller = module.get<FriendshipInvitationController>(FriendshipInvitationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
