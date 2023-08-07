import { PartialType } from '@nestjs/swagger';
import { CreateCommunityConversationDto } from './create-community-conversation.dto';

export class UpdateCommunityConversationDto extends PartialType(CreateCommunityConversationDto) {}
