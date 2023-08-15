import { Module } from '@nestjs/common';
import { CommunityRequestService } from '@app/v1/REST/services/group/community-request/community-request.service';
import { CommunityRequestController } from '@app/v1/REST/controllers/group/community-request/community-request.controller';

@Module({
  controllers: [CommunityRequestController],
  providers: [CommunityRequestService]
})
export class CommunityRequestModule {}
