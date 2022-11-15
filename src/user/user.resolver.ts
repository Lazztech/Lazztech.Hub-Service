import { Logger, UseGuards } from '@nestjs/common';
import { Args, Directive, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';
import { Block } from '../dal/entity/block.entity';
import { User } from '../dal/entity/user.entity';
import { UserId } from '../decorators/user.decorator';
import { UpdateUserInput } from './dto/updateUser.input';
import { UserService } from './user.service';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { FileUpload } from 'src/file/interfaces/file-upload.interface';

@UseGuards(GqlJwtAuthGuard)
@Resolver()
export class UserResolver {
  private logger = new Logger(UserResolver.name);

  constructor(
    private userService: UserService,
  ) {
    this.logger.debug('constructor');
  }

  @Query(() => User, { nullable: true })
  public async me(@UserId() userId): Promise<User> {
    this.logger.debug(this.me.name);
    return await this.userService.getUser(userId);
  }

  @Directive(
    '@deprecated(reason: "Use updateUser instead.")',
  )
  @Mutation(() => User)
  public async editUserDetails(
    @UserId() userId,
    @Args({ name: 'firstName', type: () => String }) firstName: string,
    @Args({ name: 'lastName', type: () => String }) lastName: string,
    @Args({ name: 'description', type: () => String }) description: string,
  ): Promise<User> {
    this.logger.debug(this.editUserDetails.name);
    const user = await this.userService.editUserDetails(userId, {
      firstName,
      lastName,
      description,
    });
    return user;
  }

  @Mutation(() => User)
  public async updateUser(
    @UserId() userId,
    @Args({name: 'imageFile', nullable: true, type: () => GraphQLUpload }) imageFile?: Promise<FileUpload>,
    @Args({ name: 'data', nullable: true, }) data?: UpdateUserInput,
  ) {
    this.logger.debug(this.updateUser.name);
    return this.userService.updateUser(userId, {
      ...data
    } as User, imageFile);
  }

  @Mutation(() => User)
  public async changeEmail(
    @UserId() userId,
    @Args({ name: 'newEmail', type: () => String }) newEmail: string,
  ): Promise<User> {
    this.logger.debug(this.changeEmail.name);
    const user = await this.userService.changeEmail(userId, newEmail);
    return user;
  }

  @Directive(
    '@deprecated(reason: "Use updateUser instead.")',
  )
  @Mutation(() => User)
  public async changeUserImage(
    @UserId() userId,
    @Args({ name: 'newImage', type: () => String }) newImage: string,
  ): Promise<User> {
    this.logger.debug(this.changeUserImage.name);
    const user = await this.userService.changeUserImage(userId, newImage);
    return user;
  }

  @Mutation(() => Block)
  public async blockUser(
    @UserId() userId,
    @Args({ name: 'toUserId', type: () => ID }) toUserId: number,
  ) {
    this.logger.debug(this.blockUser.name);
    return await this.userService.blockUser(userId, toUserId);
  }

  @Mutation(() => Block)
  public async unblockUser(
    @UserId() userId,
    @Args({ name: 'toUserId', type: () => ID }) toUserId: number,
  ) {
    this.logger.debug(this.unblockUser.name);
    return await this.userService.unblockUser(userId, toUserId);
  }
}
