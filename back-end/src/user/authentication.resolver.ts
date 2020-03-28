import { Response, UseGuards, Logger } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import * as bcrypt from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { UserId } from 'src/decorators/user.decorator';
import { AuthGuard } from 'src/guards/authguard.service';
import { InAppNotification } from '../dal/entity/inAppNotification';
import { Invite } from '../dal/entity/invite';
import { JoinUserInAppNotifications } from '../dal/entity/joinUserInAppNotifications';
import { PasswordReset } from '../dal/entity/passwordReset';
import { User } from '../dal/entity/user';
import { UserInput } from './user.input';
import { EmailService } from '../services/email.service';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Resolver()
export class AuthenticationResolver {
  private logger = new Logger(AuthenticationResolver.name, true);

  constructor(
    private emailService: EmailService,
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(InAppNotification)
    private inAppNotificationRepository: Repository<InAppNotification>
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

    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      this.logger.warn(`User not found by email address: ${email}.`);
      return null;
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      this.logger.warn(`Password not valid for user.id: ${user.id}.`);
      return null;
    }

    const tokenSecret = this.configService.get<string>('ACCESS_TOKEN_SECRET');
    const accessToken = sign({ userId: user.id }, tokenSecret);

    return accessToken;
  }

  @Mutation(() => String, { nullable: true })
  public async register(
    @Args('data') { firstName, lastName, email, password }: UserInput,
  ): Promise<string> {
    this.logger.log(this.register.name);

    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      this.logger.log(`User already exists with email address: ${email}`);
      return null;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    //TODO THIS SECTION SHOULD BE AN ACID TRANSACTION
    let user = await this.userRepository.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    user = await this.userRepository.save(user);

    const dt = Date.now();

    const inAppNotification = this.inAppNotificationRepository.create({
      text: `You'll find your notifications here.
            You can pull down to refresh and check for more.`,
      date: dt.toString(),
    });
    await this.inAppNotificationRepository.save(inAppNotification);

    const joinUserInAppNotification = JoinUserInAppNotifications.create({
      userId: user.id,
      inAppNotificationId: inAppNotification.id,
    });
    await joinUserInAppNotification.save();

    const tokenSecret = this.configService.get<string>('ACCESS_TOKEN_SECRET');
    const accessToken = sign({ userId: user.id }, tokenSecret);

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
      user.passwordReset = await PasswordReset.create({ pin });
      await this.userRepository.save(user);
      return true;
    } else {
      return false;
    }
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  public async newInvite(@Args('email') email: string): Promise<boolean> {
    this.logger.log(this.newInvite.name);

    try {
      const invite = await Invite.create({
        email,
      }).save();

      await this.emailService.sendInviteEmail(email);
      return true;
    } catch (error) {
      this.logger.error(error);
    }
  }
}
