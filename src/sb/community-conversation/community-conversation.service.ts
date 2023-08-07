import { Injectable } from '@nestjs/common';
import { CreateCommunityConversationDto } from './dto/create-community-conversation.dto';
import { UpdateCommunityConversationDto } from './dto/update-community-conversation.dto';

@Injectable()
export class CommunityConversationService {
  create(createCommunityConversationDto: CreateCommunityConversationDto) {
    return 'This action adds a new communityConversation';
  }

  findAll() {
    return `This action returns all communityConversation`;
  }

  findOne(id: number) {
    return `This action returns a #${id} communityConversation`;
  }

  update(id: number, updateCommunityConversationDto: UpdateCommunityConversationDto) {
    return `This action updates a #${id} communityConversation`;
  }

  remove(id: number) {
    return `This action removes a #${id} communityConversation`;
  }
}
