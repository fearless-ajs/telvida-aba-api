import { Injectable } from '@nestjs/common';
import { CreateCommunityInvitationDto } from '@app/v1/REST/dto/group/community-invitation/create-community-invitation.dto';
import { UpdateCommunityInvitationDto } from '@app/v1/REST/dto/group/community-invitation/update-community-invitation.dto';

@Injectable()
export class CommunityInvitationService {
  create(createCommunityInvitationDto: CreateCommunityInvitationDto) {
    return 'This action adds a new communityInvitation';
  }

  findAll() {
    return `This action returns all communityInvitation`;
  }

  findOne(id: number) {
    return `This action returns a #${id} communityInvitation`;
  }

  update(id: number, updateCommunityInvitationDto: UpdateCommunityInvitationDto) {
    return `This action updates a #${id} communityInvitation`;
  }

  remove(id: number) {
    return `This action removes a #${id} communityInvitation`;
  }
}
