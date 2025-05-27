import { IsString } from 'class-validator';

export class CreateChatDto {
  @IsString()
  text: string;

  @IsString()
  authorId: string;
}
