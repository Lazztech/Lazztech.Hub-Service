import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { verify } from 'jsonwebtoken';

import { User } from 'src/dal/entity/user';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private readonly configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    let accessToken = ctx.getContext().req.headers['authorization'];

    if (!accessToken) {
      console.error(
        "Custom Auth Checker didn't find Authorization header access token.",
      );
      return false;
    }

    const tokenSecret = this.configService.get<string>('ACCESS_TOKEN_SECRET');
    const data = verify(accessToken, tokenSecret) as any;
    if (data.userId) {
      const user = await User.findOne({
        where: { id: data.userId },
      }).catch(err => console.error(err));
      if (user) {
        ctx.getContext().req.headers['userId'] = data.userId;
        return true;
        console.log('verified access token.');
      } else {
        console.error('unable to verify access token.');
        return false;
      }
    }

    // or false if access is denied
    return false;

    return true;
  }
}
