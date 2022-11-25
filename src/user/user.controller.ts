import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res, Req, UseInterceptors } from '@nestjs/common';
import { UsersService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { FilesInterceptor } from '@nestjs/platform-express/multer/interceptors/files.interceptor';
import * as AWS from 'aws-sdk';
import { UploadedFile } from '@nestjs/common/decorators';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get('/send-email')
  async sendEmail(@Query('email') email: string) {
    const sendEmail = await this.usersService.verifyEamil(email);
    if (sendEmail === '중복') {
      return Object.assign({
        Message: "이메일이 중복되었습니다. 다른 이메일로 회원가입 해주세요.",
        success: false
      })
    }
    return Object.assign({
      verifyKey: sendEmail,
      Message: "인증메일을 전송했습니다.",
      success: true
    })
  }

  @Get('/check-verifykey')
  async check(@Query('key') key: string) {
    const checkNum = await this.usersService.checkNum(key);
    if (checkNum) {
      return Object.assign({
        Message: "이메일 인증이 완료되었습니다.",
        success: true
      })
    } else {
      return Object.assign({
        Message: "인증 코드가 다릅니다.",
        success: false
      })
    }
  }

  @Post('/register')
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.register(createUserDto);
    return Object.assign({
      success: true,
      data: user,
      statusCode: 200,
      statusMessage: '유저 생성이 완료되었습니다.'
    })
  }

  @Post('/login')
  async login(@Body('email') email: string, @Body('password') password: string, @Res() Response) {
    const token = await this.usersService.login(email, password);
    console.log(token)
    if (!token) {
      return Object.assign({
        success: false,
        massage: '로그인을 실패하였습니다.'
      })
    } else if (token === 'success') {
      return Response.json({
        success: true,
        massage: '로그인이 완료되었습니다.'
      })
    }
  }

  @Get('findAll')
  async findAll() {
    const findall = await this.usersService.findAll();
    return Object.assign({
      data: findall,
      statusCode: 200,
      statusMessage: '모든 데이터를 조회했습니다.'
    })
  }

  @Get('/findUser')
  async findOne(@Query('id') id: number) {
    const find = await this.usersService.findOne(id);
    return Object.assign({
      data: find,
      statusCode: 200,
      statusMessage: '데이터 조회에 성공했습니다.',
    })
  }

  @Get('/forgetPassword')
  async forgetPassword(@Query('email') email:string) {
    const newPassword = await this.usersService.newPassword(email)
    console.log(newPassword)
    if(newPassword == 'error') {
      return Object.assign({
        success: false,
        statusMessage: 'API 에러'
      })
    } else {
      return Object.assign({
        data: newPassword,
        success: true,
        statusMessage: '임시 비밀번호 업데이트'
      })
    }
  }

  @Get('updateUserName')
  async updateUN(@Query('userName') userName: string, @Query('email') email: string) {
    const un = await this.usersService.updateUserName(userName, email);
    if (un === 'error') {
      return Object.assign({
        success: false,
        statusMessage: '에러 발생'
      })
    } else {
      return Object.assign({
        data: userName,
        success: true,
        statusMessage: '유저네임 업데이트 완료'
      })
    }
  }

  @Get('updatePhone')
  async updatePhone(@Query('phone') phone: string, @Query('email') email: string) {
    const un = await this.usersService.updatePhone(phone, email);
    if (un === 'error') {
      return Object.assign({
        success: false,
        statusMessage: '에러 발생'
      })
    } else {
      return Object.assign({
        data: phone,
        success: true,
        statusMessage: '휴대폰 업데이트 완료'
      })
    }
  }

  @Get('updateNickName')
  async updateNickName(@Query('nickName') nickName: string, @Query('email') email: string) {
    const un = await this.usersService.updateNickName(nickName, email);
    if (un === 'error') {
      return Object.assign({
        success: false,
        statusMessage: '에러 발생'
      })
    } else {
      return Object.assign({
        data: nickName,
        success: true,
        statusMessage: '별명 업데이트 완료'
      })
    }
  }

  @Post('updateProfile')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Body('id') id:number) {
    console.log(file)
    console.log(file.originalname)
    AWS.config.update({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
    try {
      const find = await this.usersService.findOne(id)
      if (find) {
          const upload = await new AWS.S3()
            .upload({
              Key: `${Date.now() + file.originalname}`,
              Body: file.buffer,
              Bucket: process.env.AWS_S3_BUCKET_NAME,
            })
            .promise();
          find.profile = upload.Location;
          await this.usersService.updateProfile(find.profile, id);
          return Object.assign({
            data: upload.Location,
            success: true,
            statusMessage: '프로필 업데이트 완료'
          })
        } else {
        return Object.assign({
          success: false,
          statusMessage: '에러 발생'
        })
        }
      } catch (error) {
      console.log(error);
        return Object.assign({
          success: false,
          err: error,
          statusMessage: '예외 발생'
        })
      }
  }

  @Post('/updatePwd')
  async updatePWD(@Body('password') password: string, @Body('email') email: string) {
    const up = await this.usersService.updatePwd(password, email)
    if (up === 'error') {
      return Object.assign({
        success: false,
        statusMessage: '에러 발생'
      })
    } else {
      return Object.assign({
        data: password,
        success: true,
        statusMessage: '패스워드 업데이트 완료'
      })
    }
  }
}

