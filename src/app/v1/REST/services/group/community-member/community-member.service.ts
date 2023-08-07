import { Injectable } from '@nestjs/common';
import { CreateCommunityMemberDto } from '@app/v1/REST/dto/group/community-member/create-community-member.dto';
import { UpdateCommunityMemberDto } from '@app/v1/REST/dto/group/community-member/update-community-member.dto';

@Injectable()
export class CommunityMemberService {
  create(createCommunityMemberDto: CreateCommunityMemberDto) {
    return 'This action adds a new communityMember';
  }

  findAll() {
    return `This action returns all communityMember`;
  }

  findOne(id: number) {
    return `This action returns a #${id} communityMember`;
  }

  update(id: number, updateCommunityMemberDto: UpdateCommunityMemberDto) {
    return `This action updates a #${id} communityMember`;
  }

  remove(id: number) {
    return `This action removes a #${id} communityMember`;
  }
}
