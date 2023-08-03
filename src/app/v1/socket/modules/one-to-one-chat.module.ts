import { Module } from '@nestjs/common';
import { OneToOneChatGateway } from '../gateways/chat/one-to-one-chat.gateway';
import { ConversationModule } from '@app/v1/REST/modules/conversation.module';

@Module({
  imports: [ConversationModule],
  providers: [OneToOneChatGateway],
})
export class OneToOneChatModule {}
