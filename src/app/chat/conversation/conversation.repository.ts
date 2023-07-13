import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { AbstractRepository } from "@libs/database/abstract.repository";
import { Friendship } from "@app/chat/friendship/entities/friendship.entity";
import { Conversation } from "@app/chat/conversation/entities/conversation.entity";

@Injectable()
export class ConversationRepository extends AbstractRepository<Conversation> {
  protected readonly logger = new Logger(Friendship.name);

  constructor(
    @InjectModel(Conversation.name) conversationModel: Model<Conversation>,
    @InjectConnection() connection: Connection,
  ) {
    super(conversationModel, connection);
  }
}
