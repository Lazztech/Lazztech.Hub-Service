import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class ModerationInterceptor implements NestInterceptor {
  private logger = new Logger(ModerationInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(response => {
        if (response?.banned) {
          this.logger.warn(`intercepted banned object: ${JSON.stringify(response)}`);
          return;
        } else if (Array.isArray(response)) {
          return response.filter(y => {
            if (y?.banned) {
              this.logger.warn(`intercepted banned object: ${JSON.stringify(y)}`);
            }
            return !y?.banned;
          })
        } else {
          return response;
        }
      })
    );
  }
}
