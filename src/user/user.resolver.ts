import { User } from './user.entity';
import { UserService } from './user.service';
import { Resolver, Query } from '@nestjs/graphql';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [User])
  findAllUsers() {
    return this.userService.findAll();
  }
}
