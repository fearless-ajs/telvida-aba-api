import { Module } from '@nestjs/common';
import { CommunityService } from '../services/group/community/community.service';
import { CommunityController } from '@app/v1/REST/controllers/group/community/community.controller';

@Module({
  controllers: [CommunityController],
  providers: [CommunityService]
})
export class CommunityModule {}
