import { User } from "@app/v1/REST/entities/user.entity";

export class FriendshipInvitationCreatedEvent {
  constructor(public readonly sender: User, public readonly receiver: User) {}
}