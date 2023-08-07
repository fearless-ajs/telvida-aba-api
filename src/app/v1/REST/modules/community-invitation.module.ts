import { Module } from '@nestjs/common';
import { CommunityInvitationService } from '../services/group/community-invitation/community-invitation.service';
import { CommunityInvitationController } from '@app/v1/REST/controllers/group/community-invitation/community-invitation.controller';

@Module({
  controllers: [CommunityInvitationController],
  providers: [CommunityInvitationService]
})
export class CommunityInvitationModule {}
