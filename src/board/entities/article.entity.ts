import { Comment } from 'src/comment/entities/comment.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Board } from './board.entity';

@Entity({ name: 'article' })
export class Article {

    @PrimaryGeneratedColumn('increment')
    @PrimaryColumn({ unsigned: true })
    id: number;

    @Column({
        type: 'varchar',
        length: 30,
        comment: '제목'
    })
    title: string;

    @Column({
        type: 'mediumtext',
        comment: '내용'
    })
    content: string;

    @Column({
        type: 'varchar',
        length: 100,
        comment: '배너 이미지',
        default: null
    })
    image: string;

    @Column({
        type: 'int',
        comment: '조회수',
        default: 0
    })
    view: number;

    @ManyToOne(type => User, user => user.id)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({ nullable: false, unsigned: true })
    userId: number;

    @OneToMany(type => Comment, comment => comment.article)
    comment: Comment[];

    @ManyToOne(type => Board, board => board.boardId)
    @JoinColumn({ name: 'boardId' })
    board: Board;

    @Column({ nullable: false, unsigned: true })
    boardId: number;

    @CreateDateColumn({ name: 'create_at', comment: '생성일' })
    createdAt: Date;

}
