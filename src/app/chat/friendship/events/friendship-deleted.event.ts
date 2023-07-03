export class FriendshipDeletedEvent {
  constructor(public readonly initiator_id: string, public readonly receiver_id: string) {}
}