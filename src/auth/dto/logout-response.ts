import { Field, ObjectType } from '@nestjs/graphql';
import { IsBoolean } from 'class-validator';

@ObjectType()
export class LogoutResponse {
  @IsBoolean()
  @Field()
  loggedOut: boolean;
}
