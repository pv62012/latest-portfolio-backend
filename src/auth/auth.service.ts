import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { User, UserDocument } from './schema/users';
import { JwtService } from '@nestjs/jwt';
import { LoginAuthDto } from './dto/login.dto';
const bcrypt = require('bcryptjs');

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private jwtService: JwtService
  ) { }
  async create(createAuthDto: CreateAuthDto): Promise<{ token: string }> {
    const { name, email, password } = createAuthDto;
    console.log(name, email, password, 'learning fast, doing good, improving multiple skills');

    const user = await this.userModel.findOne({ email });

    if (user) {
      throw new ConflictException('Email already exist');
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const model = new this.userModel({
      name,
      email,
      password: hashedPassword
    });
    await model.save();
    const token = this.jwtService.sign({ _id: model._id })
    return { token }
  }

  async login(loginDto: LoginAuthDto): Promise<{ token: string }> {
    const { email, password } = loginDto;
    const user = await this.userModel.findOne({email});
    
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password)

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const token = this.jwtService.sign({ _id: user._id })
    return { token }
  }
  async findAll(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

  async getProfle(user: User): Promise<User> {
    return user
  }
  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
