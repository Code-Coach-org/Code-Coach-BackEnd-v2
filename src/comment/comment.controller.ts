import { Body, Controller, Delete, Post } from '@nestjs/common';
import { GetUser } from 'src/auth/getUser.decorator';
import { GetUserType } from 'src/auth/user.model';
import { User } from 'src/user/entities/user.entity';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/request/create-commnet.dto';
import { DeleteCommentByIdDto } from './dto/request/delete-comment-by-id.dto';

@Controller('comment')
export class CommentController {

    constructor(private readonly commentService: CommentService) {}

    @Post()
    async createComment(
        @GetUser() user: GetUserType,
        @Body() createCommentDto: CreateCommentDto
    ): Promise<Object> {
        await this.commentService.CreateComment(user, createCommentDto);
        return Object.assign({
            Message: "댓글이 생성되었습니다.",
            success: true
        })
    }

    @Delete()
    deleteCommentById(@Body() deleteCommentByIdDto: DeleteCommentByIdDto) {
        return this.commentService.DeleteCommentById(deleteCommentByIdDto);
    }

}

