import { Injectable } from '@nestjs/common';
import { CreateConversationAttachmentDto } from '../../../dto/chat/conversation-attachment/create-conversation-attachment.dto';
import { ConversationAttachmentRepository } from "@app/v1/REST/repositories/conversation-attachment.repository";
import { ConversationAttachment } from "@app/v1/REST/entities/conversation-attachment.entity";

@Injectable()
export class ConversationAttachmentService {
  constructor(
    private readonly conversationAttachmentRepo: ConversationAttachmentRepository,
  ) {}

  async create(createConversationAttachmentDto: CreateConversationAttachmentDto): Promise<ConversationAttachment> {
    return this.conversationAttachmentRepo.create(createConversationAttachmentDto);
  }

  async findAll(conversation_id: string): Promise<ConversationAttachment[]> {
    return this.conversationAttachmentRepo.find({ conversation_id });
  }


  async findByConversation(conversation_id: string): Promise<ConversationAttachment[]> {
    return this.conversationAttachmentRepo.find({ conversation_id });
  }

  findOne(id: string) {
    return this.conversationAttachmentRepo.find({ _id: id });
  }

  async remove(filterQuery: any): Promise<ConversationAttachment> {
    return this.conversationAttachmentRepo.findAndDelete(filterQuery);
  }

  async removeById(id: string): Promise<ConversationAttachment> {
    return this.conversationAttachmentRepo.findAndDelete({ _id: id });
  }
}
