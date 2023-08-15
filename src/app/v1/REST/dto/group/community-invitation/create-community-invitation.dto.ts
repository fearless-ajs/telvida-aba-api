import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCommunityInvitationDto {
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(500)
  email: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  communityId: string;
}
