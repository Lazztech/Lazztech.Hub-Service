import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { filter, map, Observable, throwError } from 'rxjs';

@Injectable()
export class ModerationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(response => {
        if (response?.banned) {
          console.log(response);
          return;
        }
        return response;
      })
    );
  }
}
