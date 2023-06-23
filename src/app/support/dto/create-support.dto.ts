import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateSupportDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  title: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(3000)
  description: string;

  @IsNotEmpty()
  @IsEnum([
    'low',
    'medium',
    'high',
    'closed'
  ], {
    message: 'status must either be low, medium or high'
  })
  @MaxLength(255)
  status: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  attachment?: string;
}
