import { Body, Controller, Delete, Get, Param, UseGuards, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auth/auth.guard';
import { GetUser } from 'src/auth/getUser.decorator';
import { GetUserType } from 'src/auth/user.model';
import { multerDiskDestinationOutOptions } from 'src/config/multer.config';
import { User } from 'src/user/entities/user.entity';
import { BoardService } from './board.service';
import { CreateArticleDto } from './dto/request/create-article.dto';
import { CreateBoardDto } from './dto/request/create-board.dto';
import { DeleteArticleByIdDto } from './dto/request/delete-article-by-id.dto';
import { ViewAllArticleByIdDto } from './dto/request/view-all-article-by-id.dto';
import { ViewArticleByIdDto } from './dto/request/view-article-by-id.dto';
import { Article } from './entities/article.entity';
import { Board } from './entities/board.entity';

@Controller('board')
@UseGuards(AuthGuard)
export class BoardController {
    constructor(private readonly boardService: BoardService) { }

    @Post('create')
    async createBoard(
        @GetUser() user: GetUserType,
        @Body() createBoardDto: CreateBoardDto
    ): Promise<Object> {
        await this.boardService.CreateBoard(user, createBoardDto);
        return Object.assign({
            Message: "게시판이 생성되었습니다.",
            success: true
        })
    }

    
    @Get('all')
    async viewAllBoard(): Promise<Board[]> {
        return this.boardService.ViewAllBoard();
    }

    @Get('article/:boardId/all')
    async viewAllArticle(
        @Param() viewAllArticleById: ViewAllArticleByIdDto
    ): Promise<Article[]> {
        return this.boardService.ViewAllArticle(viewAllArticleById);
    }

    @Post('create/article')
    // @UseInterceptors(FileInterceptor('file', multerDiskDestinationOutOptions))
    async createArticle(
        @GetUser() user: GetUserType,
        @Body() createArticleDto: CreateArticleDto,
        // @UploadedFile() file: Express.Multer.File
    ) {
        // const uploadFileURL = this.boardService.uploadFileBoard(createArticleDto, file);
        // await this.boardService.CreateArticle(user, createArticleDto, uploadFileURL)
        await this.boardService.CreateArticle(user, createArticleDto)
        return Object.assign({
            Message: "게시글이 생성되었습니다.",
            success: true
        })
    }

    @Delete('article')
    async deleteArticleById(
        @GetUser() user: GetUserType, 
        @Body() deleteArticleByIdDto: DeleteArticleByIdDto 
    ) {
        await this.boardService.DeleteArticleById(user, deleteArticleByIdDto);
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
