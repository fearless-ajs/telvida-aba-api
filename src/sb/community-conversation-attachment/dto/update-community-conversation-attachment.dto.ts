import { PartialType } from '@nestjs/swagger';
import { CreateCommunityConversationAttachmentDto } from './create-community-conversation-attachment.dto';

export class UpdateCommunityConversationAttachmentDto extends PartialType(CreateCommunityConversationAttachmentDto) {}
