import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassTransformer } from '@nestjs/class-transformer';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';
import { Article } from './entities/article.entity';
import { Board } from './entities/board.entity';
import { CustomNameValidation } from './util/customUniqueValidation';

@Module({
  imports: [
    TypeOrmModule.forFeature([Board, Article]),
    ClassTransformer
  ],
  controllers: [BoardController],
  providers: [BoardService, CustomNameValidation]
})
export class BoardModule { }
