export class ConversationDeletedEvent {
  constructor(
    public status: string,
    public message: string,
  ) {}
}
