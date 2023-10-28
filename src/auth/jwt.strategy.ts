import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "./schema/users";
import { Model } from "mongoose";
import { ExtractJwt, Strategy } from "passport-jwt";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private authService: AuthService
    ) {
    super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET
    });
  }

  async validate(payload): Promise<any> {
    const { _id } = payload;
    const user = await this.userModel.findById(_id, {password:0});
    if (!user) {
      throw new UnauthorizedException('Please Login first to use this endpoint');
    }
    return user;
  }
}