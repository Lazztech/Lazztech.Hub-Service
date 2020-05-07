Issue: Geofence working though not as reliably as desired.
Behavior: Geofence events sometimes throw errors when updating backend on exit or entry. Alternatively it seems that other occasions the event may not fire in the first place.

Questions:
- Is this bug related to the cordova-background-geolocation-lt plugin?
- Is the ionic `platform.ready` always when the event is triggered?
- Could any of these bugs be related to the `NativeHttpModule`, or `apollo-angular-link-http` package?
- Would improved logging in ionic help in solving this and similar issues? Should I improve the logging in the Ionic app, possibly with remote support?

Observations:
- The drift in accuracy seems to happen when the app has not been used for a few days.
- It seems to not work reliably on iOS low power mode
- iOS user permissions being properly configured/maintained seems very important in working properly. This will likely need app UX to coach the user.

Errors seen:
- First seen 02-03-2020, Last seen 02-11-2020, Total occurrences 3
    - Explanation: Either the jwt was no longer valid, in that the user didn't exist at the time. Or the jwt was not supplied effectively during the network event, possibly due to ionic/capacitor not having started up entirely yet?
    - Mitigation: This one has not shown up in a few months and I'm going to conclude that it was likely caused by my own action.
```   
graphQLErrors: [
    message: {
        statusCode: 403,
        error: Forbidden,
        message: Forbidden resource
    },
    ...
    path: [
        exitedHubGeofence
    ]
]
```

- First seen 02-09-2020, Last seen 04-25-2020, Total occurrences 9
    - Explanation:
    - Mitigation: Retry logic?
```
graphQLErrors: []
networkError: {
    headers: {
        ...
    },
    statusText: "Unknown Error",
    url: null,
    ok: false,
    name: "HttpErrorResponse",
    message: "Http failure response for (unknown url): -4 undefined"
}
```

- Seen 03-11-2020, Total occurrences 1
    - Explanation: This one suggest clearly that during the event there was not a proper network connection as far as ionic/capacitor was concerned.
    - Mitigation: Retry logic?
```
graphQLError: []
networkError: {
    headers: {
        ...
    },
    statusText: "Unknown Error",
    url: null,
    ok: false,
    name: "HttpErrorResponse",
    message: "Http failure response for (unknown url): -6 undefined",
    error: "The Internet connection appears to be offline."
}
```

Related Findings:
- https://github.com/sneas/ionic-native-http-connection-backend/issues/15
- https://fantashit.com/message-http-failure-response-for-unknown-url-0-unknown-error/
- Errors with `-4` or `-6` are difficult to find examples online
- https://github.com/ionic-team/ionic/issues/14410
- https://github.com/angular/angular/issues/22022
- https://angular.io/api/common/http/HttpErrorResponse#description

Resources:
- https://github.com/sneas/ionic-native-http-connection-backend
- https://www.youtube.com/watch?v=IJWCpa_-MeU How to Build an Ionic HTTP Loading Interceptor & Retry Logic


Logging, Error Tracking & Analytics links:
- https://ionicframework.com/integrations/category/analytics
- Sentry.io looks excellent though it doesn't play nice with capacitor... :(
    - looks like I can just get the webview logs though, which may be enough!
        - https://github.com/getsentry/sentry-cordova/issues/138
        - https://github.com/getsentry/sentry-cordova/issues/162#issuecomment-551420138