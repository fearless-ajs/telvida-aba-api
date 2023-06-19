import { IsDateString, IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateEventDto {
  @IsNotEmpty() @IsString() @MaxLength(100)
  title: string

  @IsNotEmpty() @IsDateString()
  date: string
}
