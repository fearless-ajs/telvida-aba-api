import { Conversation } from '@app/v1/REST/entities/conversation.entity';

export class ConversationDeletedEvent {
  constructor(
    public status: string,
    public readonly conversations: Conversation[],
  ) {}
}
