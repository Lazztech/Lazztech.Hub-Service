import * as bcrypt from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';
import { InAppNotification } from '../dal/entity/inAppNotification';
import { Invite } from '../dal/entity/invite';
import { JoinUserInAppNotifications } from '../dal/entity/joinUserInAppNotifications';
import { PasswordReset } from '../dal/entity/passwordReset';
import { User } from '../dal/entity/user';
import { EmailService } from '../services/emailService';
import { IMyContext } from '../graphQL/context.interface';
import { RegisterInput } from '../graphQL/inputTypes/inputUser';
import { Resolver, Query, Mutation } from '@nestjs/graphql';
import { Authorized, Ctx, Arg } from 'type-graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/authguard.service';
const datetime = require('node-datetime');

@Resolver()
export class AuthenticationResolver {
  constructor(private emailService: EmailService) {}

  //@Authorized()
  @UseGuards(AuthGuard)
  @Query(() => User, { nullable: true })
  public async me(
    @Ctx() ctx: any, //FIXME: should be a strongly typed interface
  ): Promise<User> {
    return await User.findOne({ where: { id: ctx.userId } });
  }

  @Mutation(() => String, { nullable: true })
  public async login(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() ctx: IMyContext,
  ): Promise<string> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return null;
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return null;
    }

    const accessToken = sign(
      { userId: user.id },
      process.env.ACCESS_TOKEN_SECRET,
    );
    // ctx.res.cookie("access-token", accessToken);

    return accessToken;
  }

  @Mutation(() => String, { nullable: true })
  public async register(
    @Arg('data') { firstName, lastName, email, password }: RegisterInput,
    @Ctx() ctx: IMyContext,
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

    const accessToken = sign(
      { userId: user.id },
      process.env.ACCESS_TOKEN_SECRET,
    );
    // ctx.res.cookie("access-token", accessToken);

    return accessToken;
  }

  @Mutation(() => Boolean)
  public async logout(@Ctx() ctx: IMyContext): Promise<boolean> {
    //FIXME:
    ctx.res.cookie('access-token', '', { expires: new Date(Date.now()) });
    return true;
  }

  @Mutation(() => Boolean)
  public async resetPassword(
    @Arg('usersEmail') usersEmail: string,
    @Arg('resetPin') resetPin: string,
    @Arg('newPassword') newPassword: string,
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
    @Arg('email') email: string,
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
  public async newInvite(@Arg('email') email: string): Promise<boolean> {
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
