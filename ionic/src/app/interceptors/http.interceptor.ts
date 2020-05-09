import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { NGXLogger } from 'ngx-logger';
import { EMPTY } from 'rxjs';
import { catchError, delay, map, retryWhen } from 'rxjs/operators';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {

    constructor(
        private logger: NGXLogger
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler) {

        return next.handle(request).pipe(
            retryWhen(err => {
                let entries = 1;
                return err.pipe(
                    delay(1000),
                    map(error => {
                        if (entries++ === 3) {
                            throw error;
                        }
                        return error;
                    })
                )
            }),
            catchError(err => {
                this.logger.log('failed after multiple retries', err);
                return EMPTY;
            })
        )
    }

}