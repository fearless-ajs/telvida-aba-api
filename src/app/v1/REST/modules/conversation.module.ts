import { Module } from '@nestjs/common';
import { ConversationService } from '../services/chat/conversation/conversation.service';
import { ConversationController } from '../controllers/chat/conversation/conversation.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Conversation,
  ConversationSchema,
} from '@app/v1/REST/entities/conversation.entity';
import { ConversationRepository } from '@app/v1/REST/repositories/conversation.repository';
import { FriendshipModule } from '@app/v1/REST/modules/friendship.module';
import { ConversationAttachmentModule } from '@app/v1/REST/modules/conversation-attachment.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Conversation.name, schema: ConversationSchema },
    ]),
    FriendshipModule,
    ConversationAttachmentModule,
  ],
  controllers: [ConversationController],
  providers: [ConversationService, ConversationRepository],
  exports: [ConversationService],
})
export class ConversationModule {}
