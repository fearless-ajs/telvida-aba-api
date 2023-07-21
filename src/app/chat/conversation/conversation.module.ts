import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationController } from './conversation.controller';
import { MongooseModule } from "@nestjs/mongoose";
import { Conversation, ConversationSchema } from "@app/chat/conversation/entities/conversation.entity";
import { ConversationRepository } from "@app/chat/conversation/conversation.repository";
import { FriendshipModule } from "@app/chat/friendship/friendship.module";
import { ConversationAttachmentModule } from "@app/chat/conversation-attachment/conversation-attachment.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Conversation.name, schema: ConversationSchema },
    ]),
    FriendshipModule,
    ConversationAttachmentModule
  ],
  controllers: [ConversationController],
  providers: [ConversationService, ConversationRepository]
})
export class ConversationModule {}
