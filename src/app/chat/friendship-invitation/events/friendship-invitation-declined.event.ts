import { User } from "@app/user/entities/user.entity";

export class FriendshipInvitationDeclinedEvent {
  constructor(public readonly sender: User, public readonly receiver: User) {}
}