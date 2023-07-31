import {IsEmail, IsNotEmpty, IsNumber, IsNumberString, IsString, Matches, MaxLength, MinLength} from 'class-validator';
import {Match} from "../user/create-user.dto";
import { CustomValidation } from "@libs/decorators/custom-validation.decorator";
export class ResetPasswordTokenDto {
    @IsNotEmpty() @IsNumberString()
    token: string

    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    @CustomValidation()
    new_password: string;

    @IsNotEmpty() @IsString()  @MaxLength(100)
    @Match('new_password', {
        message: "Password must match"
    })
    password_confirmation: string;
}