import { createParamDecorator } from '@nestjs/common';
import { verify } from 'jsonwebtoken';

export const UserId = createParamDecorator((data, [root, args, ctx, info]) => {
  const userId = ctx.req.headers['userId'];
  // let accessToken = ctx.getContext().req.headers['authorization'];
  return userId;
});
