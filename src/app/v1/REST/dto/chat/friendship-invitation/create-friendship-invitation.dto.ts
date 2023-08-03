import { IsEmail, IsNotEmpty, MaxLength } from "class-validator";
import { CustomValidation } from "@libs/decorators/custom-validation.decorator";

export class CreateFriendshipInvitationDto {
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(100)
  @CustomValidation()
  receiver_email: string
}
