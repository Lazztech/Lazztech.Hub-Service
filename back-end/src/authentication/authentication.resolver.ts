import { Response, UseGuards } from '@nestjs/common';
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
import { RegisterInput } from '../graphQL/inputTypes/inputUser';
import { EmailService } from '../services/email.service';
import datetime from 'node-datetime';
import { ConfigService } from '@nestjs/config';

@Resolver()
export class AuthenticationResolver {
  constructor(
    private emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  @UseGuards(AuthGuard)
  @Query(() => User, { nullable: true })
  public async me(@UserId() userId): Promise<User> {
    console.log(userId);
    return await User.findOne({ where: { id: userId } });
  }

  @Mutation(() => String, { nullable: true })
  public async login(
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<string> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return null;
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return null;
    }

    const tokenSecret = this.configService.get<string>('ACCESS_TOKEN_SECRET');
    const accessToken = sign({ userId: user.id }, tokenSecret);

    return accessToken;
  }

  @Mutation(() => String, { nullable: true })
  public async register(
    @Args('data') { firstName, lastName, email, password }: RegisterInput,
  ): Promise<string> {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return null;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // THIS SECTION SHOULD BE AN ACID TRANSACTION
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    }).save();

    const dt = datetime.create();
    const formattedDateTime = dt.format('Y-m-d H:M');

    const inAppNotification1 = InAppNotification.create({
      text: `You'll find your notifications here.
            You can pull down to refresh and check for more.`,
      date: formattedDateTime,
    });
    await inAppNotification1.save();

    const joinUserInAppNotification = JoinUserInAppNotifications.create({
      userId: user.id,
      inAppNotificationId: inAppNotification1.id,
    });
    await joinUserInAppNotification.save();

    const tokenSecret = this.configService.get<string>('ACCESS_TOKEN_SECRET');
    const accessToken = sign({ userId: user.id }, tokenSecret);

    return accessToken;
  }

  @Mutation(() => Boolean)
  public async logout(@Response() res): Promise<boolean> {
    //FIXME: not using cookies anymore?
    res.cookie('access-token', '', { expires: new Date(Date.now()) });
    return true;
  }

  @Mutation(() => Boolean)
  public async resetPassword(
    @Args('usersEmail') usersEmail: string,
    @Args('resetPin') resetPin: string,
    @Args('newPassword') newPassword: string,
  ): Promise<boolean> {
    const user = await User.findOne({
      where: { email: usersEmail },
      relations: ['passwordReset'],
    });

    const pinMatches = user.passwordReset.pin === resetPin;

    if (pinMatches) {
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      user.password = hashedPassword;
      await user.save();
      return true;
    } else {
      return false;
    }
  }

  @Mutation(() => Boolean)
  public async sendPasswordResetEmail(
    @Args('email') email: string,
  ): Promise<boolean> {
    const user = await User.findOne({
      where: { email },
      relations: ['passwordReset'],
    });

    if (user) {
      const pin = await this.emailService.sendPasswordResetEmail(
        user.email,
        `${user.firstName} ${user.lastName}`,
      );
      user.passwordReset = await PasswordReset.create({ pin });
      await user.save();
      return true;
    } else {
      return false;
    }
  }

  //@Authorized()
  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  public async newInvite(@Args('email') email: string): Promise<boolean> {
    try {
      const invite = await Invite.create({
        email,
      }).save();

      await this.emailService.sendInviteEmail(email);
      return true;
    } catch (error) {
      console.error(error);
    }
  }
}