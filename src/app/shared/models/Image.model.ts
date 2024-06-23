import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class Image {
  @IsNotEmpty()
  @IsString()
  @MaxLength(1000)
  originalUrl: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  previewUrl: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string;
}
