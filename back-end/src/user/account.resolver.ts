import { Logger, UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Invite } from 'src/dal/entity/invite.entity';
import { UserId } from 'src/decorators/user.decorator';
import { AuthGuard } from 'src/guards/authguard.service';
import { EmailService } from 'src/services/email.service';
import { Repository } from 'typeorm';
import { User } from '../dal/entity/user.entity';
import { UserService } from './user.service';

@Resolver()
export class AccountResolver {
  private logger = new Logger(AccountResolver.name, true);

  constructor(
    private userService: UserService,
    private emailService: EmailService,
    @InjectRepository(Invite)
    private inviteRepository: Repository<Invite>,
  ) {
    this.logger.log('constructor');
  }

  //@Authorized()
  @UseGuards(AuthGuard)
  @Mutation(() => User)
  public async editUserDetails(
    @UserId() userId,
    @Args({ name: 'firstName', type: () => String }) firstName: string,
    @Args({ name: 'lastName', type: () => String }) lastName: string,
    @Args({ name: 'description', type: () => String }) description: string,
  ): Promise<User> {
    this.logger.log(this.editUserDetails.name);

    const user = await this.userService.editUserDetails(userId, firstName, lastName, description);
    return user;
  }

  //@Authorized()
  @UseGuards(AuthGuard)
  @Mutation(() => User)
  public async changeEmail(
    @UserId() userId,
    @Args({ name: 'newEmail', type: () => String }) newEmail: string,
  ): Promise<User> {
    this.logger.log(this.changeEmail.name);

    const user = await this.userService.changeEmail(userId, newEmail);
    return user;
  }

  //@Authorized()
  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  public async newInvite(@Args('email') email: string): Promise<boolean> {
    this.logger.log(this.newInvite.name);

    let invite = this.inviteRepository.create({
      email,
    });
    invite = await this.inviteRepository.save(invite);

    await this.emailService.sendInviteEmail(email);
    return true;
  }

  @UseGuards(AuthGuard)
  @Mutation(() => User)
  public async changeUserImage(
    @UserId() userId,
    @Args({ name: 'newImage', type: () => String }) newImage: string,
  ): Promise<User> {
    this.logger.log(this.changeUserImage.name);

    let user = await this.userService.changeUserImage(userId, newImage);
    return user;
  }

}
