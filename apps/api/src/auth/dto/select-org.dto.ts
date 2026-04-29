import { IsNotEmpty, IsString } from 'class-validator';

export class SelectOrgDto {
  @IsString()
  @IsNotEmpty()
  orgId!: string;
}
