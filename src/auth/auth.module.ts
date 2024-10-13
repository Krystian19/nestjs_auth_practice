import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';

@Module({
  providers: [
    AuthResolver,
    AuthService,
    PrismaService,
    JwtService,
    UserService,
  ],
})
export class AuthModule {}
