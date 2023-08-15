import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class RemoveCommunityDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  communityId: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  userId: string;
}
