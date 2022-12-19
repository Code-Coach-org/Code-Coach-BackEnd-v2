import { PickType } from '@nestjs/mapped-types';
import { IsNumber } from 'class-validator';
import { BaseBoardDto } from '../base-board.dto';

export class ViewArticleByIdDto extends PickType(BaseBoardDto, ['boardId']) {

    @IsNumber()
    articleId: number; 

}