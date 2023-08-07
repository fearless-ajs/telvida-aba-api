import { Module } from '@nestjs/common';
import { CommunityConversationAttachmentService } from './community-conversation-attachment.service';
import { CommunityConversationAttachmentController } from '@app/v1/REST/controllers/group/community-conversation-attachment/community-conversation-attachment.controller';

@Module({
  controllers: [CommunityConversationAttachmentController],
  providers: [CommunityConversationAttachmentService]
})
export class CommunityConversationAttachmentModule {}
