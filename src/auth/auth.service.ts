import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { TokenPayload } from './strategy/interfaces/token-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,

    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    try {
      const user = await this.userService.getUser({ email });
      const authenticated = await bcrypt.compare(password, user.password);
      if (!authenticated) throw new Error();

      return user;
    } catch (error) {
      throw new UnauthorizedException('Credentials are not valid!');
    }
  }

  async login(user: User): Promise<string> {
    const tokenPayload: TokenPayload = {
      userId: user.id,
    };
    const token = this.jwtService.sign(tokenPayload);

    return token;
  }
}
