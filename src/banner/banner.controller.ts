import { Body, Controller, Delete, Get, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as AWS from 'aws-sdk'
import { BannerService } from './banner.service';

@Controller('banner')
export class BannerController {
    constructor(private readonly bannerService: BannerService) { 
        AWS.config.update({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            },
        });
    }

    @Post('insertBannerImage')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        try {
            const upload = await new AWS.S3()
                .upload({
                    Key: `${Date.now() + file.originalname}`,
                    Body: file.buffer,
                    Bucket: process.env.AWS_S3_BUCKET_NAME,
                })
                .promise();
            const data = await this.bannerService.insertImage(upload.Location);
            return Object.assign({
                image: data,
                success: true,
                statusMessage: '배너 이미지 삽입 완료'
            })
        } catch (error) {
            console.log(error);
            return Object.assign({
                success: false,
                err: error,
                statusMessage: '예외 발생'
            })
        }
    }

    @Get()
    async getBanner() {
        const banners = await this.bannerService.GetBanner();
        return Object.assign({
            data: banners,
            success: true,
            statusMessage: '배너 이미지 조회 완료'
        })
    }

    @Delete('removeBanner')
    async removeBanner(@Query('id') id: number) {
        const rb = await this.bannerService.removeImage(id)
        if(rb === 'del') {
            return Object.assign({
                success: true,
                statusMessage: '배너 삭제 완료'
            })
        } else {
            return Object.assign({
                success: false,
                statusMessage: '에러 발생'
            })
        }
    }

}