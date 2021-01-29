import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Payload } from '../auth/dto/payload.dto';

export const UserId = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const payload = ctx.getContext().req.user as Payload;
    return payload.userId;
  },
);
