import { ForbiddenException, Injectable } from '@nestjs/common';
import { SignUpInput } from './dto/signup-input';
import { UpdateAuthInput } from './dto/update-auth.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon from 'argon2';
import { SignInInput } from './dto/signin-input';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signUp(signUpInput: SignUpInput) {
    const hashedPassword = await argon.hash(signUpInput.password);
    const user = await this.prisma.user.create({
      data: {
        email: signUpInput.email,
        username: signUpInput.username,
        hashedPassword,
      },
    });

    const { accessToken, refreshToken } = await this.createTokens(
      user.id,
      user.email,
    );

    await this.updateRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken, user };
  }

  async signIn(signInInput: SignInInput) {
    const foundUser = await this.findOneWithEmail(signInInput.email);
    const accessDeniedErr = new ForbiddenException('Access Denied');

    if (!foundUser) {
      throw accessDeniedErr;
    }

    const doPasswordsMatch = await argon.verify(
      foundUser.hashedPassword,
      signInInput.password,
    );

    if (!doPasswordsMatch) {
      throw accessDeniedErr;
    }

    const { accessToken, refreshToken } = await this.createTokens(
      foundUser.id,
      foundUser.email,
    );

    await this.updateRefreshToken(foundUser.id, refreshToken);

    return { accessToken, refreshToken, user: foundUser };
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  async findOneWithEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  update(id: number, updateAuthInput: UpdateAuthInput) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  async createTokens(userId: number, email: string) {
    const accessTokenSecret = this.configService.get('ACCESS_TOKEN_SECRET');
    const refreshTokenSecret = this.configService.get('REFRESH_TOKEN_SECRET');

    const accessToken = this.jwtService.sign(
      {
        userId,
        email,
      },
      {
        expiresIn: '10s',
        secret: accessTokenSecret,
      },
    );

    const refreshToken = this.jwtService.sign(
      {
        userId,
        email,
        accessToken,
      },
      { expiresIn: '7d', secret: refreshTokenSecret },
    );

    return { accessToken, refreshToken };
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await argon.hash(refreshToken);
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        hashedRefreshToken,
      },
    });
  }
}
