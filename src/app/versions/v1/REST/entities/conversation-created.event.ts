import { Conversation } from "@app/versions/v1/REST/entities/conversation.entity";

export class ConversationCreatedEvent {
  constructor(public readonly conversation: Conversation) {}
}