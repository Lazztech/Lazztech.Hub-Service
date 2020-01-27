import { UseGuards } from '@nestjs/common';
import { Mutation, Resolver, Args } from '@nestjs/graphql';
import * as bcrypt from 'bcryptjs';
import { UserId } from 'src/decorators/user.decorator';
import { AuthGuard } from 'src/guards/authguard.service';
import { User } from '../dal/entity/user';
import { FileService } from 'src/services/file.service';

@Resolver()
export class AccountResolver {

  constructor(
      private fileService: FileService
    ) {}

  //@Authorized()
  @UseGuards(AuthGuard)
  @Mutation(() => User)
  public async changeName(
    @UserId() userId,
    @Args({ name: 'firstName', type: () => String }) firstName: string,
    @Args({name: 'lastName', type: () => String }) lastName: string,
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
    @Args({ name: 'newEmail', type: () => String }) newEmail: string,
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
    @Args({ name: 'oldPassword', type: () => String }) oldPassword: string,
    @Args({ name: 'newPassword', type: () => String }) newPassword: string,
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

  @UseGuards(AuthGuard)
  @Mutation(() => User)
  public async changeUserImage(
    @UserId() userId,
    @Args({ name: 'newImage', type: () => String }) newImage: string,
  ): Promise<User> {
    let user = await User.findOne(userId);

    if (user.image) {
      await this.fileService.deletePublicImageFromUrl(user.image);
    }
    const imageUrl = await this.fileService.storePublicImageFromBase64(
      newImage,
    );

    user.image = imageUrl;
    user = await user.save();
    return user;
  }

  //@Authorized()
  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  public async deleteAccount(
    @UserId() userId,
    @Args({ name: 'email', type: () => String }) email: string,
    @Args({ name: 'password', type: () => String }) password: string,
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
