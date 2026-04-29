import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsDateString,
} from 'class-validator';

export enum TodoStatus {
  TODO = 'TODO',
  DONE = 'DONE',
}

export enum TodoPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export class CreateTodoDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TodoPriority)
  @IsOptional()
  priority?: TodoPriority;

  @IsDateString()
  @IsOptional()
  dueDate?: string;
}

export class UpdateTodoDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TodoStatus)
  @IsOptional()
  status?: TodoStatus;

  @IsEnum(TodoPriority)
  @IsOptional()
  priority?: TodoPriority;

  @IsBoolean()
  @IsOptional()
  isCompleted?: boolean;

  @IsDateString()
  @IsOptional()
  dueDate?: string;
}
