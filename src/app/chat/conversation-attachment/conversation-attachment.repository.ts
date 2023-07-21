import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { AbstractRepository } from "@libs/database/abstract.repository";
import { Friendship } from "@app/chat/friendship/entities/friendship.entity";
import { Conversation } from "@app/chat/conversation/entities/conversation.entity";
import { ConversationAttachment } from "@app/chat/conversation-attachment/entities/conversation-attachment.entity";

@Injectable()
export class ConversationAttachmentRepository extends AbstractRepository<ConversationAttachment> {
  protected readonly logger = new Logger(Friendship.name);

  constructor(
    @InjectModel(ConversationAttachment.name) conversationAttachmentModel: Model<ConversationAttachment>,
    @InjectConnection() connection: Connection,
  ) {
    super(conversationAttachmentModel, connection);
  }
}
