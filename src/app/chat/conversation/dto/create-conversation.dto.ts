import { IsArray, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";
import { CustomValidation } from "@libs/decorators/custom-validation.decorator";

export class CreateConversationDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  @CustomValidation()
  friendship_id: string

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  @CustomValidation()
  message?: string

  @IsOptional()
  @IsArray()
  @MaxLength(1000)
  @CustomValidation()
  files?: any[]

}
