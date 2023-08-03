import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsFile } from "nestjs-form-data";
import { IsEnum, IsLatLong, IsMobilePhone, IsOptional, IsString, MaxLength } from "class-validator";

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  firstname?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  lastname?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  username?: string;

  @IsOptional()
  @IsLatLong()
  @MaxLength(255)
  location?: string

  @IsOptional()
  @IsEnum([
    'parent',
    'caregiver',
    'advocate',
    'at-risk or undocumented parent',
    'professional',
    'other'
  ], {
    message: "role should either be 'parent', 'caregiver',  'advocate',  'at-risk or undocumented parent', 'professional' or 'other'."
  })
  @MaxLength(255)
  role?: string;


  @IsOptional()
  @IsString()
  @MaxLength(3000)
  bio?: string;

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
  image?: any;

  @IsOptional()
  @IsFile()
  identity_proof?: any;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  country?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  state?: string

  @IsOptional()
  @IsString()
  @MaxLength(100)
  zone?: string;
}
