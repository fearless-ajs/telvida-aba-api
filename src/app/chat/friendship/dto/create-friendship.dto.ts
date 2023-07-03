import { IsEmail, IsNotEmpty, IsString, MaxLength } from "class-validator";
import { CustomValidation } from "@libs/decorators/custom-validation.decorator";

export class CreateFriendshipDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  @CustomValidation()
  initiator_id: string

  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  @CustomValidation()
  receiver_id: string
}
