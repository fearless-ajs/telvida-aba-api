import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { events } from '@config/constants';
import { FriendshipInvitationEmailService } from '@libs/mail/friendship-invitation-email/friendship-invitation-email.service';
import { FriendshipInvitationCreatedEvent } from '@app/v1/REST/events/chat/friendship-invitation/friendship-invitation-created.event';
import { FriendshipInvitationAcceptedEvent } from '@app/v1/REST/events/chat/friendship-invitation/friendship-invitation-accepted.event';
import { FriendshipInvitationDeclinedEvent } from '@app/v1/REST/events/chat/friendship-invitation/friendship-invitation-declined.event';

@Injectable()
export class FriendshipInvitationEventListenerService {
  constructor(
    private readonly friendshipInvitationEmailService: FriendshipInvitationEmailService,
  ) {}

  @OnEvent(events.FRIENDSHIP_INVITATION_CREATED)
  async dispatchReceiverFriendshipInvitationCreatedNotification(
    payload: FriendshipInvitationCreatedEvent,
  ) {
    const { sender, receiver } = payload;
    await this.friendshipInvitationEmailService.sendFriendshipInvitationCreateMessage(
      sender,
      receiver,
    );
  }

  @OnEvent(events.FRIENDSHIP_INVITATION_ACCEPTED)
  async dispatchSenderFriendshipInvitationAcceptedNotification(
    payload: FriendshipInvitationAcceptedEvent,
  ) {
    const { sender, receiver } = payload;
    await this.friendshipInvitationEmailService.sendFriendshipInvitationAcceptedMessage(
      sender,
      receiver,
    );
  }

  @OnEvent(events.FRIENDSHIP_INVITATION_DECLINED)
  async dispatchSenderFriendshipInvitationDeclinedNotification(
    payload: FriendshipInvitationDeclinedEvent,
  ) {
    const { sender, receiver } = payload;
    await this.friendshipInvitationEmailService.sendFriendshipInvitationDeclinedMessage(
      sender,
      receiver,
    );
  }
}
