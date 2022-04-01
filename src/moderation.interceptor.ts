import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class ModerationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(response => {
        if (response?.banned) {
          console.log('intercepted banned', response);
          return;
        } else if (Array.isArray(response)) {
          return response.filter(y => {
            console.log('intercepted banned', y);
            return !y.banned;
          })
        } else {
          return response;
        }
      })
    );
  }
}
