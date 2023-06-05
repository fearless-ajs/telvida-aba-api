import {IsEmail, IsNotEmpty, IsNumber, IsNumberString, IsString, MaxLength, MinLength} from 'class-validator';
export class VerifyTokenDto {
    @IsNotEmpty() @IsNumberString()
    token: string
}