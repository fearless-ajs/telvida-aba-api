import { ArrayNotEmpty, IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";
import { CustomValidation } from "@libs/decorators/custom-validation.decorator";

export class DeleteConversationDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  @CustomValidation()
  friendship_id: string

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @CustomValidation()
  conversation_ids: string[]

  @IsNotEmpty()
  @IsString()
  @IsEnum([
    'for_me',
    'for_everyone'
  ], {
    message: "delete_type should be either for_me or for_everyone "
  })
  @CustomValidation()
  delete_type?: string

}
