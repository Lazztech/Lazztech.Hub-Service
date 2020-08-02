import { Logger, Response, UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserId } from 'src/decorators/user.decorator';
import { AuthGuard } from 'src/guards/authguard.service';
import { UserInput } from '../user/dto/user.input';
import { AuthService } from './auth.service';
import { AuthPasswordResetService } from './auth-password-reset/auth-password-reset.service';

@Resolver()
export class AuthResolver {
  private logger = new Logger(AuthResolver.name, true);

  constructor(
    private authService: AuthService,
    private authPasswordResetService: AuthPasswordResetService,
  ) {
    this.logger.log('constructor');
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

    const accessToken = await this.authService.register(
      firstName,
      lastName,
      email,
      password,
    );
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
    const result = await this.authPasswordResetService.resetPassword({
      usersEmail,
      resetPin,
      newPassword,
    });
    return result;
  }

  @Mutation(() => Boolean)
  public async sendPasswordResetEmail(
    @Args('email') email: string,
  ): Promise<boolean> {
    this.logger.log(this.sendPasswordResetEmail.name);
    const result = await this.authPasswordResetService.sendPasswordResetEmail(
      email,
    );
    return result;
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  public async changePassword(
    @UserId() userId,
    @Args({ name: 'oldPassword', type: () => String }) oldPassword: string,
    @Args({ name: 'newPassword', type: () => String }) newPassword: string,
  ): Promise<boolean> {
    this.logger.log(this.changePassword.name);
    const result = await this.authService.changePassword(userId, {
      oldPassword,
      newPassword,
    });
    return result;
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  public async deleteAccount(
    @UserId() userId,
    @Args({ name: 'email', type: () => String }) email: string,
    @Args({ name: 'password', type: () => String }) password: string,
  ): Promise<boolean> {
    this.logger.log(this.deleteAccount.name);
    const result = await this.authService.deleteAccount(
      userId,
      email,
      password,
    );
    return result;
  }
}
