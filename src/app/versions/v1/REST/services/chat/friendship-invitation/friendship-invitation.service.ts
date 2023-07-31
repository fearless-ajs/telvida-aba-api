import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateFriendshipInvitationDto } from '../../../dto/chat/friendship-invitation/create-friendship-invitation.dto';
import { UpdateFriendshipInvitationStatusDto } from '../../../dto/chat/friendship-invitation/update-friendship-invitation-status.dto';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { FriendshipInvitationRepository } from '@app/versions/v1/REST/repositories/friendship-invitation.repository';
import { FriendshipInvitation } from '@app/versions/v1/REST/entities/friendship-invitation.entity';
import { UserService } from '@app/versions/v1/REST/services/user/user.service';
import { Request } from 'express';
import { IFilterableCollection } from '@libs/helpers/response-controller';
import { events } from '@config/constants';
import { FriendshipInvitationCreatedEvent } from '@app/versions/v1/REST/events/chat/friendship-invitation/friendship-invitation-created.event';
import { Types } from 'mongoose';
import { FriendshipInvitationAcceptedEvent } from '@app/versions/v1/REST/events/chat/friendship-invitation/friendship-invitation-accepted.event';
import { FriendshipInvitationDeclinedEvent } from '@app/versions/v1/REST/events/chat/friendship-invitation/friendship-invitation-declined.event';
import { FriendshipService } from '@app/versions/v1/REST/services/chat/friendship/friendship.service';
import { FriendshipDeletedEvent } from '@app/versions/v1/REST/events/chat/friendship/friendship-deleted.event';

@Injectable()
export class FriendshipInvitationService {
  constructor(
    private readonly friendshipInvitationRepo: FriendshipInvitationRepository,
    private readonly userService: UserService,
    private readonly friendshipService: FriendshipService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(
    createFriendshipInvitationDto: CreateFriendshipInvitationDto,
    userId: string,
  ): Promise<FriendshipInvitation> {
    const { receiver_email } = createFriendshipInvitationDto;
    const sender = await this.userService.getUser({
      _id: new Types.ObjectId(userId),
    });

    // Check if the user exist
    const user = await this.userService.getUser({ email: receiver_email });
    if (!user) {
      throw new NotFoundException(
        `User Not found with the email: ${receiver_email}`,
      );
    }

    // Prevent user from sending invitation to itself
    if (receiver_email === sender.email) {
      throw new ConflictException(
        'You cannot send friendship invitation to yourself',
      );
    }

    //Check if the request has been sent already by the user
    const invitation = await this.friendshipInvitationRepo.documentExist({
      sender_id: userId,
      receiver_id: user._id,
    });
    if (invitation) {
      throw new ConflictException('Invitation sent already');
    }

    const sentInvitation = await this.friendshipInvitationRepo.create({
      sender_id: userId,
      receiver_id: user._id.toString(),
      status: 'pending',
    });

    // Dispatch invitation sent event
    this.eventEmitter.emit(
      events.FRIENDSHIP_INVITATION_CREATED,
      new FriendshipInvitationCreatedEvent(sender, user),
    );

    return sentInvitation;
  }

  async findAll(req: Request): Promise<IFilterableCollection> {
    return this.friendshipInvitationRepo.findAllFiltered(req);
  }

  async findOne(id: string): Promise<FriendshipInvitation> {
    return this.friendshipInvitationRepo.findOne({ _id: id });
  }

  async updateStatus(
    id: string,
    updateFriendshipInvitationStatusDto: UpdateFriendshipInvitationStatusDto,
  ): Promise<FriendshipInvitation> {
    const { status } = updateFriendshipInvitationStatusDto;

    // Fetch the current invitation
    const invitation = await this.friendshipInvitationRepo.documentExist({
      _id: id,
    });
    if (!invitation) {
      throw new NotFoundException(
        `Invitation record not found with the id: ${invitation}`,
      );
    }

    // Check if the invitation status is same
    if (invitation.status === status) {
      throw new ConflictException(`invitation status already at: ${status}`);
    }

    const new_invitation = this.friendshipInvitationRepo.findOneAndUpdate(
      { _id: id },
      { status },
    );

    const sender = await this.userService.getUser({
      _id: new Types.ObjectId(invitation.sender_id),
    });
    const receiver = await this.userService.getUser({
      _id: new Types.ObjectId(invitation.receiver_id),
    });

    // Dispatch status updated event
    if (status === 'accepted') {
      await this.friendshipService.create(
        sender._id.toString(),
        receiver._id.toString(),
      );
      this.eventEmitter.emit(
        events.FRIENDSHIP_INVITATION_ACCEPTED,
        new FriendshipInvitationAcceptedEvent(sender, receiver),
      );
    }

    if (status === 'declined') {
      this.eventEmitter.emit(
        events.FRIENDSHIP_INVITATION_DECLINED,
        new FriendshipInvitationDeclinedEvent(sender, receiver),
      );
    }

    return new_invitation;
  }

  async remove(id: string): Promise<boolean> {
    await this.friendshipInvitationRepo.findAndDelete({ _id: id });
    return true;
  }

  // Listen for friendship deletion
  @OnEvent(events.FRIENDSHIP_DELETED)
  async deleteFriendshipInvitation(payload: FriendshipDeletedEvent) {
    const { initiator_id, receiver_id } = payload;
    await this.friendshipInvitationRepo.findAndDelete({
      sender_id: initiator_id,
      receiver_id,
    });
  }
}
