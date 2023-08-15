import { Injectable } from '@nestjs/common';
import { CreateCommunityRequestDto } from '@app/v1/REST/dto/group/community-request/create-community-request.dto';
import { UpdateCommunityRequestDto } from '@app/v1/REST/dto/group/community-request/update-community-request.dto';

@Injectable()
export class CommunityRequestService {
  create(createCommunityRequestDto: CreateCommunityRequestDto) {
    return 'This action adds a new communityRequest';
  }

  findAll() {
    return `This action returns all communityRequest`;
  }

  findOne(id: number) {
    return `This action returns a #${id} communityRequest`;
  }

  update(id: number, updateCommunityRequestDto: UpdateCommunityRequestDto) {
    return `This action updates a #${id} communityRequest`;
  }

  remove(id: number) {
    return `This action removes a #${id} communityRequest`;
  }
}
