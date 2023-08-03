import {
  IsNotEmpty,
  IsNumberString,
  IsString,
  MaxLength,
} from 'class-validator';
import { CustomValidation } from '@libs/decorators/custom-validation.decorator';
import { Match } from '@app/v1/REST/dto/user/create-user.dto';
export class ResetPasswordTokenDto {
  @IsNotEmpty()
  @IsNumberString()
  token: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @CustomValidation()
  new_password: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @Match('new_password', {
    message: 'Password must match',
  })
  password_confirmation: string;
}
