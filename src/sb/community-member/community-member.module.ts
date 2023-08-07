import { Module } from '@nestjs/common';
import { CommunityMemberService } from './community-member.service';
import { CommunityMemberController } from '@app/v1/REST/controllers/group/community-member/community-member.controller';

@Module({
  controllers: [CommunityMemberController],
  providers: [CommunityMemberService]
})
export class CommunityMemberModule {}
