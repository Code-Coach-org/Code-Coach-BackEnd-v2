import { PickType } from '@nestjs/mapped-types';
import { BaseBoardDto } from '../base-board.dto';

export class ViewAllArticleByIdDto extends PickType(BaseBoardDto, ['boardId']) {}