import { IFilterableCollection } from '@libs/helpers/response-controller';

export class ConversationsFetchEvent {
  constructor(public readonly conversations: Promise<IFilterableCollection>) {}
}
