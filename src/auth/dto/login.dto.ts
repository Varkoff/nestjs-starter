import { IsEmail, IsOptional, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: "L'adresse email est invalide." })
  email: string;

  @IsString()
  password: string;

  @IsString()
  @IsOptional()
  ipAddress: string;

  @IsString()
  @IsOptional()
  userAgent: string;
}
