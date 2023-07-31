import { IsEnum, IsNotEmpty, MaxLength } from "class-validator";

export class UpdateSupportStatusDto {
  @IsNotEmpty()
  @IsEnum([
    'low',
    'medium',
    'high',
    'closed'
  ], {
    message: 'status must either be low, medium, high or closed'
  })
  @MaxLength(255)
  status: string;
}
