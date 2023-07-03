import { User } from "@app/user/entities/user.entity";

export class FriendshipInvitationCreatedEvent {
  constructor(public readonly sender: User, public readonly receiver: User) {}
}