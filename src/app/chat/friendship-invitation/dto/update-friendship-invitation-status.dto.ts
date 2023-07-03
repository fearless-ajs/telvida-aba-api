import { IsEnum, IsNotEmpty } from "class-validator";
import { CustomValidation } from "@libs/decorators/custom-validation.decorator";

export class UpdateFriendshipInvitationStatusDto {
  @IsNotEmpty()
  @IsEnum([
    'pending',
    'accepted',
    'declined'
  ], {
    message: 'status should either be pending, accepted, or declined'
  })
  @CustomValidation()
  status: string;
}
