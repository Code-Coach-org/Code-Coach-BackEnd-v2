import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateArticleDto } from './dto/request/create-article.dto';
import { CreateBoardDto } from './dto/request/create-board.dto';
import { ViewArticleByIdDto } from './dto/request/view-article-by-id.dto';
import { Article } from './entities/article.entity';
import { Board } from './entities/board.entity';
import { uploadFileDiskDestination } from 'src/hooks/uploadFileDiskDestination';
import { DeleteArticleByIdDto } from './dto/request/delete-article-by-id.dto';
import { GetUserType } from 'src/auth/user.model';
import { plainToClass } from '@nestjs/class-transformer';

@Injectable()
export class BoardService {
    constructor(
        @InjectRepository(Board) private boardRepository: Repository<Board>,
        @InjectRepository(Article) private articleRepository: Repository<Article>
    ) { }

    async CreateBoard(user: GetUserType, createBoardDto: CreateBoardDto): Promise<void> {
        const board = plainToClass(Board, {
            ...createBoardDto,
            userId: user.id
        })
        await this.boardRepository.save(board);
    }

    async Validate(value: string): Promise<boolean> {
        return await this.boardRepository.countBy({ name: value }) ? false : true;
    }

    async ViewArticleById(viewArticleByIdDto: ViewArticleByIdDto) {
        const { articleId } = viewArticleByIdDto;
        return await this.articleRepository.findOne({
            relations: {
                board: true
            },
            where: {
                id: articleId
            }
        });
    }

    uploadFileBoard(createArticleDto: CreateArticleDto, file: Express.Multer.File): string {
        const { boardId } = createArticleDto;
        const uploadFilePath = `uploads/board/${boardId}`;
        return uploadFileDiskDestination(file, uploadFilePath);
    }

    async CreateArticle(
        user: GetUserType,
        createArticleDto: CreateArticleDto, 
        uploadFileURL: string
    ): Promise<void> {
        const article = plainToClass(Article, {
            ...createArticleDto,
            image: uploadFileURL,
            userId: user.id
        })
        await this.articleRepository.save(article);
    }

    async DeleteArticleById(deleteArticleByIdDto: DeleteArticleByIdDto) {
        const { articleId } = deleteArticleByIdDto;
        if (!await this.articleRepository.countBy({ id: articleId })) {
            throw new NotFoundException("게시글을 찾을 수 없습니다.");
        }
        await this.articleRepository.delete({ id: articleId });
    }

}
