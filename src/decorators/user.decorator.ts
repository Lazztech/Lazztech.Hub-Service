import { createParamDecorator, ExecutionContext, Logger } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const UserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const logger = new Logger(createParamDecorator.name, true);
    logger.log('executing');
    return GqlExecutionContext.create(ctx).getContext().req.headers.userId;
  },
);
