import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateCommunityMemberDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  communityId: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  userId: string;

  @IsOptional()
  @IsBoolean()
  admin?: boolean;
}
