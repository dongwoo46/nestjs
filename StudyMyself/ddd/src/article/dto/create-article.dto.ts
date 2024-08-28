import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { User } from 'src/user/entities/user.entity';

export class CreateArticleDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsNumber()
  @IsOptional()
  likes?: number;

  @IsNumber()
  @IsOptional()
  views?: number;

  @IsOptional()
  user?: User;
}
