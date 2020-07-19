// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { NgxLoggerLevel, LoggerConfig } from 'ngx-logger';
import { FirebaseOptions } from '@firebase/app-types';
import { BrowserOptions }from "@sentry/browser";

export const environment = {
  production: false,
  featureFlags: {
    statusPage: false,
    hubActivityDetails: false
  },
  logging: {
    level: NgxLoggerLevel.DEBUG,
    serverLogLevel: NgxLoggerLevel.DEBUG,
    // serverLoggingUrl: ''
  } as LoggerConfig,
  sentry: {
    dsn: "https://772d0460b07a4d968cc3829a395ea446@o388920.ingest.sentry.io/5226414"
  } as BrowserOptions,
  firebaseConfig: {
    apiKey: "AIzaSyBBglG9CZgnduympgyS4mjSwVR8apl2Ztw",
    authDomain: "stack-push-notifications.firebaseapp.com",
    databaseURL: "https://stack-push-notifications.firebaseio.com",
    projectId: "stack-push-notifications",
    storageBucket: "",
    messagingSenderId: "770608014197",
    appId: "1:770608014197:web:95204a00ce87de89",
    vapidKey: 'BIt104gFwsv7X4-5R9vW9RIGV1TtMUHvRFsrMWWI5ez162UkiKbJpQL6Iq9n_ELYqG6FiTNLFQWidq-Kid6s9EE'
  } as FirebaseOptions
};

export const SERVER_URL = 'https://lazztechhubdev.azurewebsites.net/graphql';
// export const SERVER_URL = 'https://hubserver.lazz.tech/graphql';
//  export const SERVER_URL = 'http://localhost:8080/graphql';
// export const SERVER_URL = 'http://192.168.1.25:7071/graphql';

export const GOOGLE_MAPS_KEY = 'AIzaSyB3v329F0sXT3vhrJncIfP_N1ipiNuXZOw';

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
