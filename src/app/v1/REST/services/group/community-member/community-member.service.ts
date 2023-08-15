import { Injectable } from '@nestjs/common';
import { CreateCommunityMemberDto } from '@app/v1/REST/dto/group/community-member/create-community-member.dto';
import { UpdateCommunityMemberDto } from '@app/v1/REST/dto/group/community-member/update-community-member.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CommunityMemberRepository } from '@app/v1/REST/repositories/community-member.repository';
import { CommunityMember } from '@app/v1/REST/entities/community-member.entity';
import { CommunityService } from "@app/v1/REST/services/group/community/community.service";

@Injectable()
export class CommunityMemberService {
  constructor(
    private readonly communityMemberRepo: CommunityMemberRepository,
    // private readonly communityService: CommunityService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(
    createCommunityMemberDto: CreateCommunityMemberDto,
  ): Promise<CommunityMember> {
    return this.communityMemberRepo.create(createCommunityMemberDto);
  }

  findAll() {
    return `This action returns all communityMember`;
  }

  async findMembers(communityId: string): Promise<CommunityMember[]> {
    return await this.communityMemberRepo.find({ communityId });
  }

  async findOne(id: string): Promise<CommunityMember> {
    return this.communityMemberRepo.documentExist({ _id: id });
  }

  async findOneMember(communityId: string, userId): Promise<CommunityMember> {
    return this.communityMemberRepo.documentExist({ communityId, userId });
  }

  async update(
    id: string,
    updateCommunityMemberDto: UpdateCommunityMemberDto,
  ): Promise<CommunityMember> {
    return this.communityMemberRepo.findOneAndUpdate(
      { _id: id },
      updateCommunityMemberDto,
    );
  }

  async remove(id: string): Promise<boolean> {
    await this.communityMemberRepo.findAndDelete({ _id: id });
    return true;
  }
}
