import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as nodeMailer from 'nodemailer'
import * as jwt from 'jsonwebtoken'


@Injectable()
export class UsersService {
  authNum: string

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) { }

  async verifyEamil(email: string): Promise<string> {
    this.authNum = Math.random().toString().substring(2, 6);
    const find = await this.usersRepository.findOneBy({ email })
    if(!find) {
      const transporter = nodeMailer.createTransport({
        service: 'gmail',
        auth: { 
          user: process.env.EMAIL,
          pass: process.env.PASS 
        },
      })

      const mailOptions = {
        to: email,
        subject: '가입 인증 메일',
        html:
          `<p style='color: black'>회원 가입을 위한 인증번호 입니다.</p>
        <p style = 'color:black'>아래의 인증 번호를 입력하여 인증을 완료해주세요.</p>
        <h2>${this.authNum}</h2>`,
      }

      await transporter.sendMail(mailOptions)
      return this.authNum;
    } else {
      return '중복'
    }
  }

  async checkNum(verifyKey: string) {
    if(this.authNum === verifyKey) {
      return true
    } else {
      return false
    }
  }

  async register(createUserDto: CreateUserDto): Promise<User> {
    console.log(createUserDto)
    const { userName, email, password, phone } = createUserDto
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = this.usersRepository.create({
      userName,
      email,
      password: hashedPassword,
      phone
    })
    await this.usersRepository.save(user);
    return user
  }

  async login(email: string, pwd: string) {
    if (typeof email !== "string" && typeof pwd !== "string") {
      return false;
    }
    const find = await this.usersRepository.findOneBy({email})
    if (!find) {
      throw new NotFoundException(`Can't find`)
    } else {
      const hashedPassword = find.password
      const isPassword = await bcrypt.compare(pwd, hashedPassword);
      if(isPassword) {    
        const token = jwt.sign({
          id: find.id,
          userName: find.userName,
          email: find.email,
        }, 'secretToken')
        find.token = token
        await this.usersRepository.save(find);
        return token;
      } else {
        console.log('error')
      }
    }
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const find = await this.usersRepository.findOneBy({id})
    if (!find) {
      throw new NotFoundException(`Can't find ${id}`)
    } else {
      return find;
    }
  }

  async newPassword(email: string) {
    const temPwd = 'temporaryPassword';
    const find = await this.usersRepository.findOneBy({ email })
    find.password = temPwd;
    await this.usersRepository.save(find);
    if (find) {
      const transporter = nodeMailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASS
        },
      })

      const mailOptions = {
        to: email,
        subject: '비밀번호 찾기',
        html:
          `<p style='color: black'>임시 비밀번호를 발송합니다.</p>
        <p style = 'color:black'>아래의 임시 비밀번호로 로그인 하시고, 설정에서 로그인을 바꿔주세요.</p>
        <h2>${temPwd}</h2>`,
      }
      await transporter.sendMail(mailOptions)
      return temPwd;
    } else {
      return 'error'
    }
  }

  async updateUserName(userName: string, email: string) {
    const find = await this.usersRepository.findOneBy({ email })
    if (find) {
      find.userName = userName;
      await this.usersRepository.save(find);
      return find
    } else {
      return 'error'
    }
  }

  async updateNickName(nickName: string, email: string) {
    const find = await this.usersRepository.findOneBy({ email })
    if (find) {
      find.nickName = nickName;
      await this.usersRepository.save(find);
      return find
    } else {
      return 'error'
    }
  }

  async updatePhone(phone: string, email: string) {
    const find = await this.usersRepository.findOneBy({ email })
    if (find) {
      find.phone = phone;
      await this.usersRepository.save(find);
      return find
    } else {
      return 'error'
    }
  }

  async updateProfile(location: string, id: number) {
    const find = await this.usersRepository.findOneBy({id})
    find.profile = location
    console.log(find.profile)
    await this.usersRepository.save(find)
  }

  async updatePwd(pwd: string, email: string) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(pwd, salt);
    const find = await this.usersRepository.findOneBy({ email })
    console.log(find)
    if (find) {
      find.password = hashedPassword
      await this.usersRepository.save(find);
      return find
    } else {
      return 'error'
    }
  }

  async removeToken(email: string) {
    const find = await this.usersRepository.findOneBy({ email })
    if (find) {
      find.token = null
      await this.usersRepository.save(find);
      return find
    } else {
      return 'error'
    }
  }
}