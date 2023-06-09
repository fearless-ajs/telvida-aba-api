import { IsDateString, IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateAccessTokenDto {
    @IsNotEmpty() @IsString() @MaxLength(100)
    name: string

    @IsNotEmpty() @IsDateString()
    expiry_date: Date
}
