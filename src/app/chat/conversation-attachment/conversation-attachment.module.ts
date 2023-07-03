import { Module } from '@nestjs/common';
import { ConversationAttachmentService } from './conversation-attachment.service';
import { ConversationAttachmentController } from './conversation-attachment.controller';

@Module({
  controllers: [ConversationAttachmentController],
  providers: [ConversationAttachmentService]
})
export class ConversationAttachmentModule {}
