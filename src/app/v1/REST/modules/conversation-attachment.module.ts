import { Module } from '@nestjs/common';
import { ConversationAttachmentService } from '../services/chat/conversation-attachment/conversation-attachment.service';
import { MongooseModule } from "@nestjs/mongoose";
import {
  ConversationAttachment,
  ConversationAttachmentSchema
} from "@app/v1/REST/entities/conversation-attachment.entity";
import { ConversationAttachmentRepository } from "@app/v1/REST/repositories/conversation-attachment.repository";

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
