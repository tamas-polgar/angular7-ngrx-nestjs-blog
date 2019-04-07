import { IsNotEmpty } from 'class-validator';

export class ArticleDto {

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  body: string;

}
