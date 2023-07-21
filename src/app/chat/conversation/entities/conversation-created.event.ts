import { Conversation } from "@app/chat/conversation/entities/conversation.entity";

export class ConversationCreatedEvent {
  constructor(public readonly conversation: Conversation) {}
}