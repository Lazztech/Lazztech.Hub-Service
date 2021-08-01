import { Logger, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserId } from '../decorators/user.decorator';
import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';
import { User } from '../dal/entity/user.entity';
import { UserService } from './user.service';

@UseGuards(GqlJwtAuthGuard)
@Resolver()
export class UserResolver {
  private logger = new Logger(UserResolver.name);

  constructor(private userService: UserService) {
    this.logger.log('constructor');
  }

  @Query(() => User, { nullable: true })
  public async me(@UserId() userId): Promise<User> {
    this.logger.log(this.me.name);
    return await this.userService.getUser(userId);
  }

  @Mutation(() => User)
  public async editUserDetails(
    @UserId() userId,
    @Args({ name: 'firstName', type: () => String }) firstName: string,
    @Args({ name: 'lastName', type: () => String }) lastName: string,
    @Args({ name: 'description', type: () => String }) description: string,
  ): Promise<User> {
    this.logger.log(this.editUserDetails.name);
    const user = await this.userService.editUserDetails(userId, {
      firstName,
      lastName,
      description,
    });
    return user;
  }

  @Mutation(() => User)
  public async changeEmail(
    @UserId() userId,
    @Args({ name: 'newEmail', type: () => String }) newEmail: string,
  ): Promise<User> {
    this.logger.log(this.changeEmail.name);
    const user = await this.userService.changeEmail(userId, newEmail);
    return user;
  }

  @Mutation(() => User)
  public async changeUserImage(
    @UserId() userId,
    @Args({ name: 'newImage', type: () => String }) newImage: string,
  ): Promise<User> {
    this.logger.log(this.changeUserImage.name);
    const user = await this.userService.changeUserImage(userId, newImage);
    return user;
  }
}
