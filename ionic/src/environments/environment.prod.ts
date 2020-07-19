import { NgxLoggerLevel, LoggerConfig } from 'ngx-logger';
import { FirebaseOptions } from '@firebase/app-types';
import { BrowserOptions } from '@sentry/browser';

export const environment = {
  production: true,
  featureFlags: {
    statusPage: false,
    hubActivityDetails: false,
    paidHubSubscriptionTier: false,
    //https://github.com/adorableio/avatars-api-middleware
    adorableAvatarsUserImage: true,
    uberRequestRide: true
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

// export const SERVER_URL = 'https://lazztechhubdev.azurewebsites.net/graphql';
export const SERVER_URL = 'https://lazztechhub.azurewebsites.net/graphql';
// export const SERVER_URL = 'https://hubserver.lazz.tech/graphql';

export const GOOGLE_MAPS_KEY = 'AIzaSyB3v329F0sXT3vhrJncIfP_N1ipiNuXZOw';