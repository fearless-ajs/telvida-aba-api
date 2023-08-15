import {
  IsLatLong,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { CustomValidation } from '@libs/decorators/custom-validation.decorator';

export class CreateCommunityDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  @CustomValidation()
  name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  @CustomValidation()
  image?: string;

  @IsNotEmpty()
  @IsLatLong()
  @MaxLength(500)
  @CustomValidation()
  location: string;

  @IsOptional()
  @IsString()
  @MaxLength(3000)
  @CustomValidation()
  description: string;
}
