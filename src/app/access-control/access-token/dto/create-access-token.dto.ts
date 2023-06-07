import { IsDateString, IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateAccessTokenDto {
    @IsNotEmpty() @IsString() @MaxLength(100)
    name: string

    @IsNotEmpty() @IsDateString()
    expiry_date: Date

    @IsNotEmpty() @IsString() @MaxLength(200)
    user_id: string // The user that created the token.

}
