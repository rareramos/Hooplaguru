# Seeding Data
`server/seeds.es6.js`

# iOS 9 issues
Make sure that you have the following at the bottom of your info.plist file (inside the last `</plist>` and the last `</dict>` declarations);

```
<key>NSAppTransportSecurity</key>
<dict>
  <key>NSAllowsArbitraryLoads</key>
  <true/>
</dict>
```

# Tracking
We use heap and appsee to do tracking and analytics
## Find out where the user come from
We may need to associate the new user with the new campaign
- facebook
- iAd
- Google play
- invite
- other

## Intergrations
[Segment](segment.com)
[Heap](heapanalytics.com)
[Branch](branch.io)

# Branch Setup

## iOS

Add the following key and string to hoopla-Info.plist after the project has opened in
Xcode:
```
<key>branch_key</key>
<string>key_live_jjc5dUIJSxIbJHdn8BEPEdhfytclu4Oo</string>
```

Make sure the following entitlements are added:
```
<dict>
	<key>com.apple.developer.associated-domains</key>
	<array>
		<string>applinks:app.hoopla.social</string>
		<string>applinks:bnc.lt</string>
	</array>
</dict>
```

# cordova-build-override/config.xml
We override config.xml for meteor cordova because we want to add universal link
support. When we add new cordova packages, we need to rebuild this file.
```
<universal-links>
  <host name="app.hoopla.social" />
</universal-links>
```

# TEST PROCEDURE

## (HOST) login, invite and post images
- login
- create an event
- add a guest
- send an invitation
- new guest login
- host see all users
- guest see all users
- host post on the wall
- host post image on the wall
- host comment
- guest comment
- host add photos
- host add an anouncement

## (GUEST) get invite from SMS, no app installed
- user should get invite
- go to website
- click yes -> user get an error saying "cannot open the page, because the address is invalid"
  TODO: this error message should not be there
  NOTE: we might want to detect if the url is valid and do not open the app scheme
- user download the app
- using his phone number
- see the event

## (GUEST) get invite from SMS, app is installed
- go to website
- click yes, 'OPEN THE PAGE IN HOOPLA'?
- see the event

## (GUEST) get invite from Email, no app installed

## (GUEST) get invite from Email, app is installed
- go to website
- type in phone number, click yes
- enter verification code, click OK, 'OPEN THE PAGE IN HOOPLA'?
- see the event

## Android Build

`meteor build ~/meteor-build/ --server=app.hoopla.social --mobile-settings settings-production.json`

`cd ~/meteor-build/android/project/build/outputs/apk/`

`jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 android-armv7-release-unsigned.apk hoopla.keystore`
`jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 android-x86-release-unsigned.apk hoopla.keystore`

Multiple APKs are necessary because we are using crosswalk to target different Android architectures. Be sure to upload the apk after running each zipalign command.

`$ANDROID_HOME/build-tools/23.0.2/zipalign 4 android-armv7-release-unsigned.apk Hoopla.apk`
`$ANDROID_HOME/build-tools/23.0.2/zipalign 4 android-x86-release-unsigned.apk Hoopla.apk`

## iOS Build

Include the `branch_key` property in the Info.plist.
Add the appropriate entitlements in Xcode's Capabilities seciton.
