import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatOnlineDto } from '@app/v1/socket/dto/chat/chat-online.dto';
import { ChatOfflineDto } from '@app/v1/socket/dto/chat/chat-offline.dto';
import { ChatTypingDto } from '@app/v1/socket/dto/chat/chat-typing.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class OneToOneChatGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('chatOnline')
  online(
    @MessageBody() data: ChatOnlineDto,
    @ConnectedSocket() client: Socket,
  ) {
    // TODO
    //emits to everybody except to sender
    client.broadcast.emit(`partner_online_${data.friendshipId}`, {
      data,
    } as unknown as any);
  }

  @SubscribeMessage('chatOffline')
  offline(
    @MessageBody() data: ChatOfflineDto,
    @ConnectedSocket() client: Socket,
  ) {
    // TODO
    //emits to everybody except to sender
    client.broadcast.emit(`partner_offline_${data.friendshipId}`, {
      data,
    } as unknown as any);
  }

  @SubscribeMessage('chatTyping')
  typing(
    @MessageBody() data: ChatTypingDto,
    @ConnectedSocket() client: Socket,
  ) {
    // TODO
    //emits to everybody except to sender
    client.broadcast.emit(`partner_typing_${data.friendshipId}`, {
      data,
    } as unknown as any);
  }
}
