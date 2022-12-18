import { Body, Controller, Delete, Get, Param, ParseFloatPipe, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerDiskDestinationOutOptions } from 'src/config/multer.config';
import { BoardService } from './board.service';
import { CreateArticleDto } from './dto/request/create-article.dto';
import { CreateBoardDto } from './dto/request/create-board.dto';
import { DeleteArticleByIdDto } from './dto/request/delete-article-by-id.dto';
import { ViewArticleByIdDto } from './dto/request/view-article-by-id.dto';

@Controller('board')
export class BoardController {
    constructor(private readonly boardService: BoardService) { }

    @Post('create')
    async createBoard(@Body() createBoardDto: CreateBoardDto): Promise<Object> {
        await this.boardService.CreateBoard(createBoardDto);
        return Object.assign({
            Message: "게시판이 생성되었습니다.",
            success: true
        })
    }

    @Post('create/article')
    @UseInterceptors(FileInterceptor('file', multerDiskDestinationOutOptions))
    async createArticle(
        @Body() createArticleDto: CreateArticleDto,
        @UploadedFile() file: Express.Multer.File
    ) {
        const uploadFileURL = this.boardService.uploadFileBoard(createArticleDto, file);
        await this.boardService.CreateArticle(createArticleDto, uploadFileURL)
        return Object.assign({
            Message: "게시글이 생성되었습니다.",
            success: true
        })
    }

    @Delete('article')
    async deleteArticleById(
        @Body() deleteArticleByIdDto: DeleteArticleByIdDto 
    ) {
        await this.boardService.DeleteArticleById(deleteArticleByIdDto);
        return Object.assign({
            Message: "게시글이 삭제되었습니다.",
            success: true
        })
    }

    @Get(':boardId/:articleId')
    async viewArticleById(
        @Param() viewArticleByIdDto: ViewArticleByIdDto
    ) {
        return this.boardService.ViewArticleById(viewArticleByIdDto);
    }

}
