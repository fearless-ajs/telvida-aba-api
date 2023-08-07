import { Module } from '@nestjs/common';
import { CommunityConversationService } from './community-conversation.service';
import { CommunityConversationController } from '@app/v1/REST/controllers/group/community-conversation/community-conversation.controller';

@Module({
  controllers: [CommunityConversationController],
  providers: [CommunityConversationService]
})
export class CommunityConversationModule {}
