import { createParamDecorator } from '@nestjs/common';
import { verify } from 'jsonwebtoken';

export const UserId = createParamDecorator((data, [root, args, ctx, info]) => {
  //FIXME make sure this get the authorization header correctly
  const accessToken = ctx.request.headers['authorization'];
  const jwtData = accessToken
    ? (verify(accessToken, process.env.ACCESS_TOKEN_SECRET) as any)
    : undefined;
  const userId = data ? jwtData.userId : undefined;
  return userId;
});
