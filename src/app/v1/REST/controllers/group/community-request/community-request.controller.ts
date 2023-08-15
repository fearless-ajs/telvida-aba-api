import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CommunityRequestService } from '../../../services/group/community-request/community-request.service';
import { CreateCommunityRequestDto } from '@app/v1/REST/dto/group/community-request/create-community-request.dto';
import { UpdateCommunityRequestDto } from '@app/v1/REST/dto/group/community-request/update-community-request.dto';

@Controller('community-request')
export class CommunityRequestController {
  constructor(private readonly communityRequestService: CommunityRequestService) {}

  @Post()
  create(@Body() createCommunityRequestDto: CreateCommunityRequestDto) {
    return this.communityRequestService.create(createCommunityRequestDto);
  }

  @Get()
  findAll() {
    return this.communityRequestService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.communityRequestService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommunityRequestDto: UpdateCommunityRequestDto) {
    return this.communityRequestService.update(+id, updateCommunityRequestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.communityRequestService.remove(+id);
  }
}
