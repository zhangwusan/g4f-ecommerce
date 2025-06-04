import { IsString } from 'class-validator';

export class CreateCareInstructionDto {
  @IsString()
  instruction: string;
}