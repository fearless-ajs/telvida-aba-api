import { IsEnum, IsNotEmpty, IsString, MaxLength } from "class-validator";
import { CustomValidation } from "@libs/decorators/custom-validation.decorator";

export class CreateConversationAttachmentDto {
  @IsNotEmpty()
  @IsString()
  @CustomValidation()
  conversation_id: string

  @IsNotEmpty()
  @IsString()
  @CustomValidation()
  path: string

  @IsNotEmpty()
  @IsString()
  @MaxLength(1000)
  @CustomValidation()
  originalName: string

  @IsNotEmpty()
  @IsString()
  @MaxLength(1000)
  @CustomValidation()
  size?: string

  @IsNotEmpty()
  @IsString()
  @MaxLength(1000)
  @CustomValidation()
  encoding?: string

  @IsNotEmpty()
  @IsString()
  @MaxLength(1000)
  @CustomValidation()
  mimetype?: string

  @IsNotEmpty()
  @IsString()
  @IsEnum([
    'active',
    'deleted'
  ], {
    message: 'status should be either active or deleted'
  })
  @CustomValidation()
  status: string

}
