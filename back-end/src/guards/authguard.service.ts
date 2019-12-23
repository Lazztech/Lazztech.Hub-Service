import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { verify } from 'jsonwebtoken';

import { User } from 'src/dal/entity/user';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    let accessToken = ctx.getContext().req.headers['authorization'];

    // let accessToken = context.req.headers["authorization"];
    // let accessToken = context.req.headers["Authorization"];
    // let accessToken = context.req.get("Authorization");

    // }
    if (!accessToken) {
      console.error(
        "Custom Auth Checker didn't find Authorization header access token.",
      );
      return false;
    }

    const data = verify(accessToken, process.env.ACCESS_TOKEN_SECRET) as any;
    if (data.userId) {
      const user = await User.findOne({
        where: { id: data.userId },
      }).catch(err => console.error(err));
      if (user) {
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
