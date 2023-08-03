import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { events } from '@config/constants';
import { ConversationCreatedEvent } from '@app/v1/REST/entities/conversation-created.event';
import { WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ConversationDeletedEvent } from '@app/v1/REST/events/chat/conversation/conversation-deleted.event';

@Injectable()
export class ConversationEventListenerService {
  @WebSocketServer() server: Server;

  @OnEvent(events.CONVERSATION_CREATED)
  async dispatchConversationToReceiver(payload: ConversationCreatedEvent) {
    //emits to everybody including sender
    this.server.emit(
      `conversation_created_${payload.conversation.friendship_id}`,
      payload.conversation,
    );
  }

  @OnEvent(events.CONVERSATION_DELETED)
  async dispatchDeletedConversationToReceiver(
    payload: ConversationDeletedEvent,
  ) {
    //emits to everybody including sender
    this.server.emit(`conversations_deleted`, payload);
  }
}
