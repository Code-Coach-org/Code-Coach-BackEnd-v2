import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BoardModule } from './board/board.module';
import { UsersModule } from './user/user.module';
import { GroupModule } from './group/group.module';
import { ConfigModule } from '@nestjs/config';
import { BannerModule } from './banner/banner.module';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PW,
      database: process.env.DB_NAME,
      synchronize: true,
      logging: true,
      entities: [__dirname + '/**/entities/*.entity.{js,ts}']
    }),
    BoardModule,
    UsersModule,
    GroupModule,
    BannerModule,
    CommentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
