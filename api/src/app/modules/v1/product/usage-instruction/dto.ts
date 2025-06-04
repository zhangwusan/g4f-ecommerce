import { IsString } from 'class-validator';

export class CreateUsageInstructionDto {
  @IsString()
  instruction: string;
}