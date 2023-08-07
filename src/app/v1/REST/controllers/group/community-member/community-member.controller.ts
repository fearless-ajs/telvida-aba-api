import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CommunityMemberService } from '../../../../../../sb/community-member/community-member.service';
import { CreateCommunityMemberDto } from '../../../../../../sb/community-member/dto/create-community-member.dto';
import { UpdateCommunityMemberDto } from '../../../../../../sb/community-member/dto/update-community-member.dto';

@Controller('community-member')
export class CommunityMemberController {
  constructor(private readonly communityMemberService: CommunityMemberService) {}

  @Post()
  create(@Body() createCommunityMemberDto: CreateCommunityMemberDto) {
    return this.communityMemberService.create(createCommunityMemberDto);
  }

  @Get()
  findAll() {
    return this.communityMemberService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.communityMemberService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommunityMemberDto: UpdateCommunityMemberDto) {
    return this.communityMemberService.update(+id, updateCommunityMemberDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.communityMemberService.remove(+id);
  }
}
