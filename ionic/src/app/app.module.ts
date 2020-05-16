import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { ApolloModule, Apollo } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SERVER_URL } from 'src/environments/environment';

import { setContext } from "apollo-link-context";
import { Storage, IonicStorageModule } from '@ionic/storage';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

import { HttpBackend, HttpXhrBackend } from '@angular/common/http';
import { NativeHttpModule, NativeHttpBackend, NativeHttpFallback } from 'ionic-native-http-connection-backend';

import { ReactiveFormsModule } from '@angular/forms';
import BackgroundGeolocation from 'cordova-background-geolocation-lt';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';
import { SentryIonicErrorHandler } from './errors/sentryIonicErrorHandler';
import * as Sentry from "@sentry/browser";
import { HttpRequestInterceptor } from './interceptors/http.interceptor';
import { LoggerModule, NGXLogger } from 'ngx-logger';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    // HttpClientModule,
    NativeHttpModule,
    ApolloModule,
    HttpLinkModule,
    IonicStorageModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    ReactiveFormsModule,
    LoggerModule.forRoot(environment.logging),
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HttpBackend, useClass: NativeHttpFallback, deps: [Platform, NativeHttpBackend, HttpXhrBackend] },
    { provide: ErrorHandler, useClass: SentryIonicErrorHandler },
    { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true },
    BackgroundGeolocation,
    FingerprintAIO,
    Diagnostic
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(
    apollo: Apollo, 
    httpLink: HttpLink, 
    storage: Storage,
    private logger: NGXLogger
    ) {

    Sentry.init(environment.sentry);

    const apolloLink = httpLink.create({
      uri: SERVER_URL,
      withCredentials: true
    });

    const auth = setContext(async (_, { headers }) => {
      const token = await storage.get('token');
      if (!token) {
        this.logger.error("Couldn't add jwt to header.");
        return {};
      } else {
        return {
          headers: {
            ...headers,
            Authorization: token
          }
        };
      }
    });


    apollo.create({
      link: auth.concat(apolloLink),
      cache: new InMemoryCache(),
    })
  }
}

