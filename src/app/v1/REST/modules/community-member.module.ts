import { forwardRef, Module } from "@nestjs/common";
import { CommunityMemberService } from '../services/group/community-member/community-member.service';
import { CommunityMemberController } from '@app/v1/REST/controllers/group/community-member/community-member.controller';
import { CommunityMemberRepository } from '@app/v1/REST/repositories/community-member.repository';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CommunityMember,
  CommunityMemberSchema,
} from '@app/v1/REST/entities/community-member.entity';
import { CommunityModule } from '@app/v1/REST/modules/community.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CommunityMember.name, schema: CommunityMemberSchema },
    ]),
    // forwardRef(() => CommunityModule),
  ],
  controllers: [CommunityMemberController],
  providers: [CommunityMemberService, CommunityMemberRepository],
  exports: [CommunityMemberService],
})
export class CommunityMemberModule {}
