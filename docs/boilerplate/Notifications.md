# Notifications

## Roll Your Own Notifications Service
Roll your own web push notifications backend
    - [Push Notifications Using Node.js & Service Worker](https://www.youtube.com/watch?v=HlYFW2zaYQM)
    - https://github.com/web-push-libs/web-push

Apollo GraphQL Subscriptions could be used as a fall back when you want direct server -> client notifications on all platforms without depending on google's or apple's push notification services. This could allow locally hosted servers to notify a device on an intranet when internet connectivity is not available. Apollo GraphQL subscriptions use websockets.

- https://www.youtube.com/watch?v=_r2ooFgBdoc

## Firebase Cloud Message
Firebase Cloud Messaging seems to serve as a utility for web push notifications, and native apple and android push notifications.

Pros:
    - Cheap
    - Covers all platforms

Cons:
    - Reliance on a third party service
    - May require use of firebase as backend for auth to send notifications to individual users

- https://medium.com/@david.dalbusco/add-web-push-notifications-to-your-ionic-pwa-358f6ec53c6f
- [Web Push Notifications with Ionic4 and Firebase Cloud Messaging](https://www.youtube.com/watch?v=m_P1Q0vhOHs&t=75s)
- [](https://www.youtube.com/watch?v=SOOjamH1bAA&t=260s)

Testing FCM:
```
curl -X POST -H "Authorization: key=SERVER_KEY" -H "Content-Type: application/json" -d '{
"notification": {
    "title": "Web Push Notifications",
    "body": "Hey, Hello World",
    "click_action": "https://mywebsite.ccom"
},
"to": "USER_TOKEN"
}' "https://fcm.googleapis.com/fcm/send"
```

## iOS Notification


Resources Used:
- [Ionic Native Push Notifications + Firebase Cloud Messaging](https://www.youtube.com/watch?v=SOOjamH1bAA)
- https://capacitor.ionicframework.com/docs/guides/push-notifications-firebase