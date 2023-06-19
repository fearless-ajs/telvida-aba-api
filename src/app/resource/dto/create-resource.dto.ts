import { IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";
import { IsFile } from "nestjs-form-data";

export class CreateResourceDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string

  @IsNotEmpty()
  @IsFile()
  file: any
}
