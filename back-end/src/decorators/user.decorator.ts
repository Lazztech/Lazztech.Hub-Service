import { createParamDecorator, Logger } from '@nestjs/common';
import { verify } from 'jsonwebtoken';

export const UserId = createParamDecorator((data, [root, args, ctx, info]) => {
  const logger = new Logger(createParamDecorator.name, true);
  logger.log("executing");

  const userId = ctx.req.headers['userId'];
  // let accessToken = ctx.getContext().req.headers['authorization'];
  return userId;
});
