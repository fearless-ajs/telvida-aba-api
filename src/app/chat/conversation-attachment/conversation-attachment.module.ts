import { Module } from '@nestjs/common';
import { ConversationAttachmentService } from './conversation-attachment.service';
import { MongooseModule } from "@nestjs/mongoose";
import {
  ConversationAttachment,
  ConversationAttachmentSchema
} from "@app/chat/conversation-attachment/entities/conversation-attachment.entity";
import { ConversationAttachmentRepository } from "@app/chat/conversation-attachment/conversation-attachment.repository";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ConversationAttachment.name, schema: ConversationAttachmentSchema },
    ]),
  ],
  providers: [ConversationAttachmentService, ConversationAttachmentRepository],
  exports: [
    ConversationAttachmentService
  ]
})
export class ConversationAttachmentModule {}
