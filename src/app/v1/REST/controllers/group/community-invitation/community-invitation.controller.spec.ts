import { Test, TestingModule } from '@nestjs/testing';
import { CommunityInvitationController } from './community-invitation.controller';
import { CommunityInvitationService } from '../../../services/group/community-invitation/community-invitation.service';

describe('CommunityInvitationController', () => {
  let controller: CommunityInvitationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommunityInvitationController],
      providers: [CommunityInvitationService],
    }).compile();

    controller = module.get<CommunityInvitationController>(CommunityInvitationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
