import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { retryWhen, delay, map, catchError } from 'rxjs/operators';
import { EMPTY } from 'rxjs';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {

    constructor() { }

    intercept(request: HttpRequest<any>, next: HttpHandler) {

        return next.handle(request).pipe(
            retryWhen(err => {
                let entries = 1;
                return err.pipe(
                    delay(1000),
                    //  tap(() => {

                    //  }),
                    map(error => {
                        if(entries++ === 3) {
                            throw error;
                        }
                        return error;
                    })
                )
            }),
            catchError(err => {
                console.log('failed after multiple retries', err);
                return EMPTY;
            })
        )
    }

}