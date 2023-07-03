import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ConversationAttachmentService } from './conversation-attachment.service';
import { CreateConversationAttachmentDto } from './dto/create-conversation-attachment.dto';
import { UpdateConversationAttachmentDto } from './dto/update-conversation-attachment.dto';

@Controller('conversation-attachment')
export class ConversationAttachmentController {
  constructor(private readonly conversationAttachmentService: ConversationAttachmentService) {}

  @Post()
  create(@Body() createConversationAttachmentDto: CreateConversationAttachmentDto) {
    return this.conversationAttachmentService.create(createConversationAttachmentDto);
  }

  @Get()
  findAll() {
    return this.conversationAttachmentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.conversationAttachmentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateConversationAttachmentDto: UpdateConversationAttachmentDto) {
    return this.conversationAttachmentService.update(+id, updateConversationAttachmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.conversationAttachmentService.remove(+id);
  }
}
