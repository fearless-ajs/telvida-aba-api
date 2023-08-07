import { Injectable } from '@nestjs/common';
import { CreateCommunityConversationAttachmentDto } from '@app/v1/REST/dto/group/community-conversation-attachment/create-community-conversation-attachment.dto';
import { UpdateCommunityConversationAttachmentDto } from '@app/v1/REST/dto/group/community-conversation-attachment/update-community-conversation-attachment.dto';

@Injectable()
export class CommunityConversationAttachmentService {
  create(createCommunityConversationAttachmentDto: CreateCommunityConversationAttachmentDto) {
    return 'This action adds a new communityConversationAttachment';
  }

  findAll() {
    return `This action returns all communityConversationAttachment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} communityConversationAttachment`;
  }

  update(id: number, updateCommunityConversationAttachmentDto: UpdateCommunityConversationAttachmentDto) {
    return `This action updates a #${id} communityConversationAttachment`;
  }

  remove(id: number) {
    return `This action removes a #${id} communityConversationAttachment`;
  }
}
