import { IsEmail, IsString } from 'class-validator';

export class RegisterUserDto {
  @IsEmail({}, { message: 'Veuillez fournir une adresse email valide' })
  email: string;

  @IsString()
  password: string;
}
