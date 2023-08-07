import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CommunityInvitationService } from '../../../../../../sb/community-invitation/community-invitation.service';
import { CreateCommunityInvitationDto } from '../../../../../../sb/community-invitation/dto/create-community-invitation.dto';
import { UpdateCommunityInvitationDto } from '../../../../../../sb/community-invitation/dto/update-community-invitation.dto';

@Controller('community-invitation')
export class CommunityInvitationController {
  constructor(private readonly communityInvitationService: CommunityInvitationService) {}

  @Post()
  create(@Body() createCommunityInvitationDto: CreateCommunityInvitationDto) {
    return this.communityInvitationService.create(createCommunityInvitationDto);
  }

  @Get()
  findAll() {
    return this.communityInvitationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.communityInvitationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommunityInvitationDto: UpdateCommunityInvitationDto) {
    return this.communityInvitationService.update(+id, updateCommunityInvitationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.communityInvitationService.remove(+id);
  }
}
