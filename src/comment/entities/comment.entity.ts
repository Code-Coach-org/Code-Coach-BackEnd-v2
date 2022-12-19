import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, JoinColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Article } from 'src/board/entities/article.entity';

@Entity({ name: 'comment' })
export class Comment {

    @PrimaryGeneratedColumn('increment')
    @PrimaryColumn({ unsigned: true })
    commentId!: number;

    @ManyToOne(type => User, user => user.id)
    @JoinColumn({ name: 'userId' })
    user!: User;

    @Column({ nullable: false, unsigned: true })
    userId!: number;

    @ManyToOne(type => Article)
    @JoinColumn({ name: 'articleId' })
    article!: Article;

    @Column({
        type: Boolean,
        default: false
    })
    deleted!: boolean;

    @Column({ 
        nullable: false, 
        unsigned: true 
    })
    articleId!: number;

    @Column({
        unsigned: true
    })
    depth!: number;

    @Column({
        default: false
    })
    parent!: boolean;

    @Column({
        nullable: true,
        unsigned: true
    })
    parentId?: number | null;

    @CreateDateColumn()
    createdAt!: Date;

    @Column({
        type: 'text'
    })
    content!: string;
}
