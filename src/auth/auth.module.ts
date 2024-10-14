import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';

@Module({
  providers: [
    AuthResolver,
    AuthService,
    PrismaService,
    JwtService,
    UserService,
    AccessTokenStrategy,
  ],
})
export class AuthModule {}
