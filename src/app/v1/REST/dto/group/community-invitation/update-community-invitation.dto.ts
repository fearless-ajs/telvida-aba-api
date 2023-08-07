import { PartialType } from '@nestjs/swagger';
import { CreateCommunityInvitationDto } from './create-community-invitation.dto';

export class UpdateCommunityInvitationDto extends PartialType(CreateCommunityInvitationDto) {}
