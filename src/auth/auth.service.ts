import {
  BadRequestException,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Auth } from './schema/schema-auth';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateAuthDto } from './dto/create-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Auth.name) private authModel: Model<Auth>,
    private jwtService: JwtService,
  ) {}

  async login(data: CreateAuthDto) {
    const { studentId, password } = data;

    const admin = await this.authModel.findOne({ studentId });

    if (!admin) {
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      throw new HttpException('Incorrect Credentials', HttpStatus.BAD_REQUEST);
    }
    const token = await this.generateToken(admin);
    return { token };
  }

  async signup(data: CreateAuthDto) {
    const { studentId, password } = data;

    const existingId = await this.authModel.findOne({ studentId });
    if (existingId) {
      throw new BadRequestException('User Exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.authModel.create({
      studentId,
      password: hashedPassword,
    });

    return { message: 'Account Successfully Created' };
  }

  async generateToken(admin) {
    const token = this.jwtService.sign({
      id: admin._id,
      studentId: admin.studentId,
    });

    return token;
  }
}
