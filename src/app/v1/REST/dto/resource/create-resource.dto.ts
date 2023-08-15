import {
  IsLatLong,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { CustomValidation } from "@libs/decorators/custom-validation.decorator";

export class CreateResourceDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @CustomValidation()
  name: string;

  @IsNotEmpty()
  @IsOptional()
  @CustomValidation()
  resource_file: any;

  @IsNotEmpty()
  @IsString()
  @MaxLength(4000)
  @CustomValidation()
  description: string;

  @IsOptional()
  @IsLatLong()
  @MaxLength(255)
  @CustomValidation()
  location?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @CustomValidation()
  country?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @CustomValidation()
  state?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @CustomValidation()
  zone?: string;
}
