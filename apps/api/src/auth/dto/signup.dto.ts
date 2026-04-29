import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export enum UserRoleType {
  MANAGER = 'manager',
  USER = 'user',
}

export class SignupDto {
  @IsString()
  @IsNotEmpty()
  fullName!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsEnum(UserRoleType)
  role!: UserRoleType;

  @IsString()
  @IsOptional()
  organizationName?: string;
}
