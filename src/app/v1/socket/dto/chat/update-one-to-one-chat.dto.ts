import { PartialType } from '@nestjs/mapped-types';
import { CreateOneToOneChatDto } from './create-one-to-one-chat.dto';

export class UpdateOneToOneChatDto extends PartialType(CreateOneToOneChatDto) {
  id: number;
}
