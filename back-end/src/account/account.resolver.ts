import { UseGuards } from '@nestjs/common';
import { Mutation, Resolver } from '@nestjs/graphql';
import * as bcrypt from 'bcryptjs';
import { UserId } from 'src/decorators/user.decorator';
import { AuthGuard } from 'src/guards/authguard.service';
import { Arg } from 'type-graphql';
import { User } from '../dal/entity/user';

@Resolver()
export class AccountResolver {
  //@Authorized()
  @UseGuards(AuthGuard)
  @Mutation(() => User)
  public async changeName(
    @UserId() userId,
    @Arg('firstName') firstName: string,
    @Arg('lastName') lastName: string,
  ): Promise<User> {
    const user = await User.findOne({ where: { id: userId } });
    user.firstName = firstName;
    user.lastName = lastName;
    await user.save();

    return user;
  }

  //@Authorized()
  @UseGuards(AuthGuard)
  @Mutation(() => User)
  public async changeEmail(
    @UserId() userId,
    @Arg('newEmail') newEmail: string,
  ): Promise<User> {
    const user = await User.findOne({ where: { id: userId } });
    user.email = newEmail;
    await user.save();

    return user;
  }

  //@Authorized()
  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  public async changePassword(
    @UserId() userId,
    @Arg('oldPassword') oldPassword: string,
    @Arg('newPassword') newPassword: string,
  ): Promise<boolean> {
    const user = await User.findOne({ where: { id: userId } });

    const valid = await bcrypt.compare(oldPassword, user.password);

    if (valid) {
      const newHashedPassword = await bcrypt.hash(newPassword, 12);
      user.password = newHashedPassword;
      await user.save();

      return true;
    } else {
      return false;
    }
  }

  //@Authorized()
  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  public async deleteAccount(
    @UserId() userId,
    @Arg('email') email: string,
    @Arg('password') password: string,
  ): Promise<boolean> {
    const user = await User.findOne({ where: { id: userId } });

    const valid = await bcrypt.compare(password, user.password);

    if (valid && email === user.email) {
      await user.remove();
      return true;
    } else {
      return false;
    }
  }
}