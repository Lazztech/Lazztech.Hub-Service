import { verify } from 'jsonwebtoken';
import { AuthChecker } from 'type-graphql';
import { User } from '../dal/entity/user';
import { IMyContext } from './context.interface';
import { Logger } from '@nestjs/common';

export const customAuthChecker: AuthChecker<any> = async (
  { root, args, context, info },
  roles,
) => {
  const logger = new Logger(customAuthChecker.name, true);
  logger.log('executing');

  // here we can read the user from context
  // and check his permission in the db against the `roles` argument
  // that comes from the `@Authorized` decorator, eg. ["ADMIN", "MODERATOR"]

  let accessToken = context.req.headers['authorization'];

  if (!accessToken) {
    logger.error(
      "Custom Auth Checker didn't find Authorization header access token.",
    );
    return false;
  }

  const data = verify(accessToken, process.env.ACCESS_TOKEN_SECRET) as any;
  if (data.userId) {
    const user = await User.findOne({ where: { id: data.userId } });
    if (user) {
      logger.log('Verified access token.');
      return true;
    } else {
      logger.error('Unable to verify access token.');
      return false;
    }
  }

  // or false if access is denied
  return false;
};
