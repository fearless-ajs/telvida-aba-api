import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsFile } from "nestjs-form-data";
import { IsEnum, IsMobilePhone, IsOptional, IsString, MaxLength } from "class-validator";

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsString()
  @MaxLength(3000)
  bio?: string

  @IsOptional()
  @IsString()
  @IsEnum([
    'active',
    'away'
  ], {
    message: 'status must be either active or away'
  })
  status?: string

  @IsOptional()
  @IsString()
  @MaxLength(100)
  displayName?: string

  @IsOptional()
  @IsMobilePhone()
  phone?: string

  @IsOptional()
  @IsFile()
  image?: any
}
