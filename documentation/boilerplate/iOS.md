# iOS

## Setup

Install build dependencies
```
sudo gem install cocoapods
xcode-select --install
pod repo update
```

Setup Capacitor
```
ionic integrations enable capacitor
npx cap init
```

Resources Used:
- https://capacitor.ionicframework.com/docs/getting-started/dependencies/
- https://capacitor.ionicframework.com/docs/getting-started/with-ionic/

## Building

```
ionic build
npx cap add ios
npx cap sync
```

For every build
```
ionic build
npx cap sync
npx cap copy
npx cap open ios
```

Resources Used:
- https://ionicframework.com/docs/building/ios


## Deploying to iOS

Setup app signing in Xcode.

- Plugin your device
- Type in pass-code on device and accept mac as trusted device
- Select your iOS device as the deployment platform
- Press the play button to build and deploy to your device

"Open Settings on iPhone and navigate to General -> Device Management, then select your Developer App certificate to trust it."

You should now be able to runt the device on your phone.

Resources Used:
- https://stackoverflow.com/questions/39524148/xcode-error-code-signing-is-required-for-product-type-application-in-sdk-ios
- https://stackoverflow.com/questions/51387873/xcode-couldnt-find-any-provisioning-profiles-matching

## Debugging on iOS
- https://ionicframework.com/docs/building/ios#debugging-ios-apps

## Deploying to App Store
- https://www.joshmorony.com/deploying-capacitor-applications-to-ios-development-distribution/

## Troubleshooting
- https://stackoverflow.com/questions/34191239/ios-9-2-missing-profile-section-from-general-settings