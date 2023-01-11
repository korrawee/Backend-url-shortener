import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUrlDto {
  @IsString()
  @IsNotEmpty()
  urlCode: string;

  @IsString()
  @IsNotEmpty()
  originalUrl: string;
}
