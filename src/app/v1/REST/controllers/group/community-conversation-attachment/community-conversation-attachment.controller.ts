import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CommunityConversationAttachmentService } from '../../../../../../sb/community-conversation-attachment/community-conversation-attachment.service';
import { CreateCommunityConversationAttachmentDto } from '../../../../../../sb/community-conversation-attachment/dto/create-community-conversation-attachment.dto';
import { UpdateCommunityConversationAttachmentDto } from '../../../../../../sb/community-conversation-attachment/dto/update-community-conversation-attachment.dto';

@Controller('community-conversation-attachment')
export class CommunityConversationAttachmentController {
  constructor(private readonly communityConversationAttachmentService: CommunityConversationAttachmentService) {}

  @Post()
  create(@Body() createCommunityConversationAttachmentDto: CreateCommunityConversationAttachmentDto) {
    return this.communityConversationAttachmentService.create(createCommunityConversationAttachmentDto);
  }

  @Get()
  findAll() {
    return this.communityConversationAttachmentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.communityConversationAttachmentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommunityConversationAttachmentDto: UpdateCommunityConversationAttachmentDto) {
    return this.communityConversationAttachmentService.update(+id, updateCommunityConversationAttachmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.communityConversationAttachmentService.remove(+id);
  }
}
