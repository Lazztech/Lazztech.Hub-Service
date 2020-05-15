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
- It seems like geofence events may not always fire in the first place
- There seems to be multiple compounding reasons for the unreliability

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

- Seen during ios packaging
```
⠙ update ios[warn] Plugin cordova-background-geolocation-lt might require you to add 
                $BACKGROUND_MODE_LOCATION
             in the existing UIBackgroundModes entry of your Info.plist to work
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
- https://github.com/getsentry/sentry-javascript/issues/1804 How can I detect client's network error through @sentry/browser ?

# Network / Cellular Related

### "I have no idea why.  Does it happen consistently?  Geofences can fail to fire based upon the nature of your network environment."
- https://github.com/transistorsoft/cordova-background-geolocation-lt/issues/422#issuecomment-320364838


### "Disabling wifi will kill geofence performance"
- https://github.com/transistorsoft/cordova-background-geolocation-lt/issues/422#issuecomment-320367255

What background location being terminated by OS looks like:
```
[c.t.l.BackgroundGeolocationService onDestroy]
```
- https://github.com/transistorsoft/cordova-background-geolocation-lt/issues/771#issuecomment-416217650

### "You must not disable cellular. iOS geofences requires cellular data to work. The plugin uses a geofence exit event to determine when it's moving."

- https://github.com/transistorsoft/cordova-background-geolocation-lt/issues/334#issuecomment-300614523

### "Yes the plugin does accurately detect network changes."
- https://github.com/transistorsoft/cordova-background-geolocation-lt/issues/334#issuecomment-300759490

### My Geofences aren't working on iOS
- https://simpleinout.helpscoutdocs.com/article/224-my-geofences-arent-working-ios

### "Make sure that you have Background App Refresh and you don't have Low Power Mode enabled in order for Geofencing to work."
- https://simpleinout.helpscoutdocs.com/article/224-my-geofences-arent-working-ios

### Why isn't the Geofencing mode working?
- https://kb.arlo.com/000062271/Why-isn-t-the-Geofencing-mode-working

### "Geofencing relies on your mobile phone internet connection so all I can think of is a poor signal in the car perhaps?"
- https://forums.macrumors.com/threads/geofencing-not-working-100.2124259/

### Maybe this isn't the help you're looking for, but here's my opinion. In general, geofencing to determine presence is sucky. There are community apps, like Presence Governor 17, and Combined Presence 6, that make presence detection way more reliable.
- https://community.hubitat.com/t/geofence-in-he-app-constantly-incorrectly-changing/33414

### Settings → General → Reset → Reset Location & Privacy
- https://community.hubitat.com/t/geofence-in-he-app-constantly-incorrectly-changing/33414/13

- https://www.reddit.com/r/HomeKit/comments/bc13n0/problem_with_homekit_automations_geofence_issue/

- https://www.reddit.com/r/HomeKit/comments/byyqiw/homekit_geofence_radius_is_too_small/

### The Secret to Effective Geofencing
- https://jwegan.com/growth-hacking/effective-geofencing/

### Geocoding
- https://en.wikipedia.org/wiki/Geocoding

### Geofencing - Why you can't rely on GPS alone
https://www.livehouseautomation.com.au/blogs/news/geofencing-why-you-cant-rely-on-gps-alone

# Logging, Error Tracking & Analytics links:
- https://ionicframework.com/integrations/category/analytics
- Sentry.io looks excellent though it doesn't play nice with capacitor... :(
    - looks like I can just get the webview logs though, which may be enough!
        - https://github.com/getsentry/sentry-cordova/issues/138
        - https://github.com/getsentry/sentry-cordova/issues/162#issuecomment-551420138

# Mitigation Attempts:
- Added sentry.io remote error tracking on ionic client
- Added http interceptor retry logic