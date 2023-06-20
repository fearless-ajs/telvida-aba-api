import { IsDateString, IsLatLong, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateEventDto {
  @IsNotEmpty() @IsString() @MaxLength(100)
  title: string

  @IsNotEmpty() @IsString() @MaxLength(4000)
  description: string

  @IsNotEmpty() @IsDateString()
  date: string;

  @IsOptional()
  @IsLatLong()
  @MaxLength(255)
  location?: string

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
