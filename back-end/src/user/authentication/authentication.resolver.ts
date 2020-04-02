import { Logger, Response, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { UserId } from 'src/decorators/user.decorator';
import { AuthGuard } from 'src/guards/authguard.service';
import { Repository } from 'typeorm';
import { PasswordReset } from '../../dal/entity/passwordReset.entity';
import { User } from '../../dal/entity/user.entity';
import { EmailService } from '../../services/email.service';
import { UserInput } from '../user.input';
import { AuthenticationService } from './authentication.service';

@Resolver()
export class AuthenticationResolver {
  private logger = new Logger(AuthenticationResolver.name, true);

  constructor(
    private emailService: EmailService,
    private authService: AuthenticationService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(PasswordReset)
    private passwordResetRepository: Repository<PasswordReset>,
  ) {
    this.logger.log('constructor');
  }

  @UseGuards(AuthGuard)
  @Query(() => User, { nullable: true })
  public async me(@UserId() userId): Promise<User> {
    this.logger.log(this.me.name);
    return await this.userRepository.findOne({ where: { id: userId } });
  }

  @Mutation(() => String, { nullable: true })
  public async login(
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<string> {
    this.logger.log(this.login.name);
    const accessToken = await this.authService.login(password, email);
    return accessToken;
  }

  @Mutation(() => String, { nullable: true })
  public async register(
    @Args('data') { firstName, lastName, email, password }: UserInput,
  ): Promise<string> {
    this.logger.log(this.register.name);

    const accessToken = await this.authService.register(firstName, lastName, email, password);
    return accessToken;
  }

  @Mutation(() => Boolean)
  public async logout(@Response() res): Promise<boolean> {
    //FIXME: not using cookies anymore?
    this.logger.log(this.logout.name);

    res.cookie('access-token', '', { expires: new Date(Date.now()) });
    return true;
  }

  @Mutation(() => Boolean)
  public async resetPassword(
    @Args('usersEmail') usersEmail: string,
    @Args('resetPin') resetPin: string,
    @Args('newPassword') newPassword: string,
  ): Promise<boolean> {
    this.logger.log(this.resetPassword.name);

    const user = await this.userRepository.findOne({
      where: { email: usersEmail },
      relations: ['passwordReset'],
    });

    const pinMatches = user.passwordReset.pin === resetPin;

    if (pinMatches) {
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      user.password = hashedPassword;
      await this.userRepository.save(user);
      return true;
    } else {
      return false;
    }
  }

  @Mutation(() => Boolean)
  public async sendPasswordResetEmail(
    @Args('email') email: string,
  ): Promise<boolean> {
    this.logger.log(this.sendPasswordResetEmail.name);

    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['passwordReset'],
    });

    if (user) {
      const pin = await this.emailService.sendPasswordResetEmail(
        user.email,
        `${user.firstName} ${user.lastName}`,
      );
      user.passwordReset = await this.passwordResetRepository.create({ pin });
      await this.userRepository.save(user);
      return true;
    } else {
      return false;
    }
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  public async changePassword(
    @UserId() userId,
    @Args({ name: 'oldPassword', type: () => String }) oldPassword: string,
    @Args({ name: 'newPassword', type: () => String }) newPassword: string,
  ): Promise<boolean> {
    this.logger.log(this.changePassword.name);

    const user = await this.userRepository.findOne({ where: { id: userId } });

    const valid = await bcrypt.compare(oldPassword, user.password);

    if (valid) {
      const newHashedPassword = await bcrypt.hash(newPassword, 12);
      user.password = newHashedPassword;
      await this.userRepository.save(user);

      return true;
    } else {
      return false;
    }
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  public async deleteAccount(
    @UserId() userId,
    @Args({ name: 'email', type: () => String }) email: string,
    @Args({ name: 'password', type: () => String }) password: string,
  ): Promise<boolean> {
    this.logger.log(this.deleteAccount.name);

    const result = await this.authService.deleteAccount(userId, email, password);
    return result;
  }
}
