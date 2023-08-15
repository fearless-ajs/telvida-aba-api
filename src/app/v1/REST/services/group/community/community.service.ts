import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommunityDto } from '@app/v1/REST/dto/group/community/create-community.dto';
import { UpdateCommunityDto } from '@app/v1/REST/dto/group/community/update-community.dto';
import { CommunityRepository } from '@app/v1/REST/repositories/community.repository';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Community } from '@app/v1/REST/entities/community.entity';
import { CommunityMemberService } from '@app/v1/REST/services/group/community-member/community-member.service';
import { Request } from 'express';
import { IFilterableCollection } from '@libs/helpers/response-controller';
import mongoose from 'mongoose';
import { RemoveCommunityDto } from '@app/v1/REST/dto/group/community/remove-community.dto';
import { CommunityMember } from '@app/v1/REST/entities/community-member.entity';
import { RemoveCommunityMemberDto } from '@app/v1/REST/dto/group/community-member/remove-community-member.dto';
import { CreateCommunityAdminDto } from '@app/v1/REST/dto/group/community/create-community-admin.dto';
import { CreateCommunityMemberDto } from '@app/v1/REST/dto/group/community-member/create-community-member.dto';
import { deleteFile } from '@libs/helpers/file-processor';
import { LeaveCommunityDto } from '@app/v1/REST/dto/group/community/leave-community.dto';

@Injectable()
export class CommunityService {
  constructor(
    private readonly communityRepo: CommunityRepository,
    private readonly communityMemberService: CommunityMemberService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(
    createCommunityDto: CreateCommunityDto,
    userId: string,
  ): Promise<Community> {
    const community = await this.communityRepo.create(createCommunityDto);

    // Add the user to members of the community and make it admin
    await this.communityMemberService.create({
      communityId: community._id.toString(),
      userId,
      admin: true,
    });

    return community;
  }

  async findAll(req: Request): Promise<IFilterableCollection> {
    return this.communityRepo.findAllFiltered(req);
  }

  async findOne(id: string): Promise<Community> {
    return this.communityRepo.findById(id);
  }

  async update(
    id: string,
    userId: string,
    updateCommunityDto: UpdateCommunityDto,
  ) {
    // validate the community Id
    if (!mongoose.isValidObjectId(id)) {
      await deleteFile(updateCommunityDto.image);
      throw new NotAcceptableException('Invalid community id');
    }

    // Check if the community exists
    const community: Community = await this.communityRepo.documentExist({
      _id: id,
    });

    if (!community) {
      await deleteFile(updateCommunityDto.image);
      throw new NotFoundException('Community not found!');
    }

    // check if the user is the admin of the group
    // verify the membership
    const membership: CommunityMember =
      await this.communityMemberService.findOneMember(id, userId);
    if (!membership) {
      await deleteFile(updateCommunityDto.image);
      throw new NotFoundException('User does not belong to the community!');
    }

    // Check if the user is an admin
    if (!membership.admin) {
      await deleteFile(updateCommunityDto.image);
      throw new NotAcceptableException('Only Admins can remove a community!');
    }

    return this.communityRepo.findOneAndUpdate({ _id: id }, updateCommunityDto);
  }

  async remove(removeCommunityDto: RemoveCommunityDto) {
    const { communityId, userId } = removeCommunityDto;

    // validate the Ids
    if (!mongoose.isValidObjectId(communityId)) {
      throw new NotAcceptableException('Invalid community id');
    }

    if (!mongoose.isValidObjectId(userId)) {
      throw new NotAcceptableException('Invalid user id');
    }

    // Check if the community exists
    const community: Community = await this.communityRepo.documentExist({
      _id: communityId,
    });

    if (!community) {
      throw new NotFoundException('Community not found!');
    }

    // verify the membership
    const membership: CommunityMember =
      await this.communityMemberService.findOneMember(communityId, userId);
    if (!membership) {
      throw new NotFoundException('User does not belong to the community!');
    }

    // Check if the user is an admin
    if (!membership.admin) {
      throw new NotAcceptableException('Only Admins can remove a community!');
    }

    // Remove all members first
    const members = await this.communityMemberService.findMembers(communityId);
    for (const member of members) {
      await this.communityMemberService.remove(member._id.toString());
    }

    await this.communityRepo.findAndDelete({ _id: communityId });
    await deleteFile(community.image);
    return true;
  }

  // Membership routes
  async removeMember(
    currentUserId: string,
    removeCommunityMemberDto: RemoveCommunityMemberDto,
  ) {
    const { communityId, userId } = removeCommunityMemberDto;

    if (!mongoose.isValidObjectId(communityId)) {
      throw new NotAcceptableException('Invalid community id');
    }

    if (!mongoose.isValidObjectId(userId)) {
      throw new NotAcceptableException('Invalid user id');
    }

    // verify the admin membership of the current user
    const adminMembership: CommunityMember =
      await this.communityMemberService.findOneMember(communityId, userId);
    if (!adminMembership) {
      throw new NotFoundException('Admin does not belong to the community!');
    }

    // Check if the current user is an admin(Only an admin can remove member)
    if (!adminMembership.admin) {
      throw new NotAcceptableException(
        'Only Admins can remove user from a community!',
      );
    }

    // check if the community exists
    const community: Community = await this.communityRepo.documentExist({
      _id: communityId,
    });

    if (!community) {
      throw new NotFoundException('Community not found!');
    }

    // verify the membership
    const membership: CommunityMember =
      await this.communityMemberService.findOneMember(communityId, userId);
    if (!membership) {
      throw new NotFoundException('User does not belong to the community!');
    }

    // Remove the membership
    await this.communityMemberService.remove(membership._id.toString());
    return true;
  }

  async leaveCommunity(leaveCommunityMemberDto: LeaveCommunityDto) {
    const { communityId, userId } = leaveCommunityMemberDto;

    if (!mongoose.isValidObjectId(communityId)) {
      throw new NotAcceptableException('Invalid community id');
    }

    if (!mongoose.isValidObjectId(userId)) {
      throw new NotAcceptableException('Invalid user id');
    }

    // check if the community exists
    const community: Community = await this.communityRepo.documentExist({
      _id: communityId,
    });

    if (!community) {
      throw new NotFoundException('Community not found!');
    }

    // verify the membership
    const membership: CommunityMember =
      await this.communityMemberService.findOneMember(communityId, userId);
    if (!membership) {
      throw new NotFoundException('User does not belong to the community!');
    }

    // Remove the membership
    await this.communityMemberService.remove(membership._id.toString());
    return true;
  }

  async makeUserAdmin(
    currentUserId: string,
    createCommunityAdminDto: CreateCommunityAdminDto,
  ): Promise<CommunityMember> {
    const { communityId, userId } = createCommunityAdminDto;

    // validate the Ids
    if (!mongoose.isValidObjectId(communityId)) {
      throw new NotAcceptableException('Invalid community id');
    }

    if (!mongoose.isValidObjectId(userId)) {
      throw new NotAcceptableException('Invalid user id');
    }

    // Check if the community exists
    const community: Community = await this.communityRepo.documentExist({
      _id: communityId,
    });

    if (!community) {
      throw new NotFoundException('Community not found!');
    }

    // verify admin status of the current user
    const membershipAdmin: CommunityMember =
      await this.communityMemberService.findOneMember(
        communityId,
        currentUserId,
      );
    if (!membershipAdmin) {
      throw new NotFoundException(
        'Logged in user does not belong to the community!',
      );
    }

    if (!membershipAdmin.admin) {
      throw new NotAcceptableException(
        'Logged in user is not the admin of the community!',
      );
    }

    // verify the membership of the user
    const membership: CommunityMember =
      await this.communityMemberService.findOneMember(communityId, userId);
    if (!membership) {
      throw new NotFoundException('User does not belong to the community!');
    }

    // Make the user an admin
    return this.communityMemberService.update(membership._id.toString(), {
      admin: true,
    });
  }

  async detachUserAsAdmin(
    currentUserId: string,
    createCommunityAdminDto: CreateCommunityAdminDto,
  ): Promise<CommunityMember> {
    const { communityId, userId } = createCommunityAdminDto;

    // validate the Ids
    if (!mongoose.isValidObjectId(communityId)) {
      throw new NotAcceptableException('Invalid community id');
    }

    if (!mongoose.isValidObjectId(userId)) {
      throw new NotAcceptableException('Invalid user id');
    }

    // Check if the community exists
    const community: Community = await this.communityRepo.documentExist({
      _id: communityId,
    });

    if (!community) {
      throw new NotFoundException('Community not found!');
    }

    // verify admin status of the current user
    const membershipAdmin: CommunityMember =
      await this.communityMemberService.findOneMember(
        communityId,
        currentUserId,
      );
    if (!membershipAdmin) {
      throw new NotFoundException(
        'Logged in user does not belong to the community!',
      );
    }

    if (!membershipAdmin.admin) {
      throw new NotAcceptableException(
        'Logged in user is not the admin of the community!',
      );
    }

    // verify the membership of the user
    const membership: CommunityMember =
      await this.communityMemberService.findOneMember(communityId, userId);
    if (!membership) {
      throw new NotFoundException('User does not belong to the community!');
    }

    // Make the user an admin
    return this.communityMemberService.update(membership._id.toString(), {
      admin: false,
    });
  }

  async acceptMember(
    currentUserId: string,
    createCommunityMemberDto: CreateCommunityMemberDto,
  ) {
    const { communityId, userId } = createCommunityMemberDto;

    if (!mongoose.isValidObjectId(communityId)) {
      throw new NotAcceptableException('Invalid community id');
    }

    if (!mongoose.isValidObjectId(userId)) {
      throw new NotAcceptableException('Invalid user id');
    }

    // check if the community exists
    const community: Community = await this.communityRepo.documentExist({
      _id: communityId,
    });

    if (!community) {
      throw new NotFoundException('Community not found!');
    }

    const membershipAdmin: CommunityMember =
      await this.communityMemberService.findOneMember(
        communityId,
        currentUserId,
      );
    if (!membershipAdmin) {
      throw new NotFoundException(
        'Logged in user does not belong to the community!',
      );
    }

    if (!membershipAdmin.admin) {
      throw new NotAcceptableException(
        'Logged in user is not the admin of the community!',
      );
    }

    // Add the user to members of the community
    return this.communityMemberService.create({
      communityId: community._id.toString(),
      userId,
      admin: false,
    });
  }
}
