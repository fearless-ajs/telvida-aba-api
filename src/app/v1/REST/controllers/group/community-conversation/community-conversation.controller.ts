import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CommunityConversationService } from '../../../services/group/community-conversation/community-conversation.service';
import { CreateCommunityConversationDto } from '../../../dto/group/community-conversation/create-community-conversation.dto';
import { UpdateCommunityConversationDto } from '../../../dto/group/community-conversation/update-community-conversation.dto';

@Controller('community-conversation')
export class CommunityConversationController {
  constructor(private readonly communityConversationService: CommunityConversationService) {}

  @Post()
  create(@Body() createCommunityConversationDto: CreateCommunityConversationDto) {
    return this.communityConversationService.create(createCommunityConversationDto);
  }

  @Get()
  findAll() {
    return this.communityConversationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.communityConversationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommunityConversationDto: UpdateCommunityConversationDto) {
    return this.communityConversationService.update(+id, updateCommunityConversationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.communityConversationService.remove(+id);
  }
}
