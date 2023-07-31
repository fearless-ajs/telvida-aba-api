import { User } from "@app/versions/v1/REST/entities/user.entity";

export class FriendshipInvitationAcceptedEvent {
  constructor(public readonly sender: User, public readonly receiver: User) {}
}