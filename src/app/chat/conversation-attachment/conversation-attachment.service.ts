import { Injectable } from '@nestjs/common';
import { CreateConversationAttachmentDto } from './dto/create-conversation-attachment.dto';
import { UpdateConversationAttachmentDto } from './dto/update-conversation-attachment.dto';

@Injectable()
export class ConversationAttachmentService {
  create(createConversationAttachmentDto: CreateConversationAttachmentDto) {
    return 'This action adds a new conversationAttachment';
  }

  findAll() {
    return `This action returns all conversationAttachment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} conversationAttachment`;
  }

  update(id: number, updateConversationAttachmentDto: UpdateConversationAttachmentDto) {
    return `This action updates a #${id} conversationAttachment`;
  }

  remove(id: number) {
    return `This action removes a #${id} conversationAttachment`;
  }
}
