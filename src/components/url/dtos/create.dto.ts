import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUrlDto {
  @IsString()
  @IsNotEmpty()
  originalUrl: string;
}
