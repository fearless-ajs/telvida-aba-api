import { PartialType } from '@nestjs/swagger';
import { CreateConversationAttachmentDto } from './create-conversation-attachment.dto';

export class UpdateConversationAttachmentDto extends PartialType(CreateConversationAttachmentDto) {}
