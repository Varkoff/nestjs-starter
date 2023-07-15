import { IsEmail, IsString } from 'class-validator';

export class ResetUserPasswordRequestDto {
  @IsEmail(
    {},
    {
      message: 'Veuillez entrer une adresse email valide.',
    },
  )
  email: string;
}

export class ResetUserPasswordDto {
  @IsString()
  password: string;
  @IsString()
  passwordConfirmation: string;
  @IsString()
  resetPasswordToken: string;
}

export class EditUserPasswordDto {
  @IsString()
  oldPassword: string;
  @IsString()
  password: string;
  @IsString()
  passwordConfirmation: string;
}
