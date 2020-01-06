App.info({
  // These two should be the same, however it was not setup correctly
  id: 'com.id1wv7fg61nhcof01rhqsd', // for android
  //id: 'com.poeticsystems.hoopla',   // for ios
  name: 'HooplaGuru',
  version: '2.2.11',
});

App.icons({
  // iOS
  'iphone_2x': 'resources/icons/ios/iphone_2x.png',
  'iphone_3x': 'resources/icons/ios/iphone_3x.png',
  'ipad':      'resources/icons/ios/ipad.png',
  'ipad_2x':   'resources/icons/ios/ipad_2x.png',
  'ios_spotlight': 'resources/icons/ios/ios_spotlight.png',
  'ios_spotlight_2x': 'resources/icons/ios/ios_spotlight_2x.png',
  'ios_settings': 'resources/icons/ios/ios_settings.png',
  'ios_settings_2x': 'resources/icons/ios/ios_settings_2x.png',
  'ios_settings_3x': 'resources/icons/ios/ios_settings_3x.png',

  // Android
  'android_mdpi':  'resources/icons/android/mdpi.png',
  'android_hdpi':  'resources/icons/android/hdpi.png',
  'android_xhdpi': 'resources/icons/android/xhdpi.png',
  'android_xxhdpi': 'resources/icons/android/xxhdpi.png',
  'android_xxxhdpi': 'resources/icons/android/xxxhdpi.png'
});

App.launchScreens({
  // iOS
  'iphone_2x':          'resources/splash/ios/iphone_2x.png',
  'iphone5':            'resources/splash/ios/iphone5.png',
  'iphone6':            'resources/splash/ios/iphone6.png',
  'iphone6p_portrait':  'resources/splash/ios/iphone6p_portrait.png',
  'ipad_portrait':      'resources/splash/ios/ipad_portrait.png',
  'ipad_portrait_2x':   'resources/splash/ios/ipad_portrait_2x.png',

  // Android
  'android_mdpi_portrait':  'resources/splash/android/mdpi_portrait.png',
  'android_hdpi_portrait':  'resources/splash/android/hdpi_portrait.png',
  'android_xhdpi_portrait': 'resources/splash/android/xhdpi_portrait.png',
});

App.setPreference('Orientation', 'portrait');
App.setPreference('StatusBarBackgroundColor', '#000000');
App.setPreference('StatusBarOverlaysWebView', false);
App.setPreference('StatusBarStyle', 'lightcontent');
App.setPreference('AndroidLaunchMode', 'singleTask');
App.setPreference('loadUrlTimeoutValue', '700000');
App.setPreference('BackupWebStorage', 'local');
App.setPreference("KeyboardDisplayRequiresUserAction",false);

App.accessRule('*');
App.accessRule('*://lorempixel.com/*');
App.accessRule('*.google.com/*');
App.accessRule('*.googleapis.com/*');
App.accessRule('*.gstatic.com/*');
App.accessRule('https://maps.googleapis.com/*');
App.accessRule('*.google.com/maps/*', { launchExternal: true });
App.accessRule('mailto:*', { launchExternal: true });
App.accessRule('sms:*', { launchExternal: true });
App.accessRule('tel:*', { launchExternal: true });
App.accessRule("blob:*");

App.configurePlugin('cordova-plugin-customurlscheme', {
  URL_SCHEME: 'eventassistmeteor'
});

App.configurePlugin('phonegap-plugin-push', {
 SENDER_ID: 211069606366
});

App.configurePlugin('cordova-plugin-facebook4', {
  APP_ID: '247077189049693',    // <- Your appId
  APP_NAME: 'Hoopla'    // <- Your app_name
});

App.configurePlugin('com.phonegap.plugins.facebookconnect', {
APP_ID: '247077189049693',    // <- Your appId
  APP_NAME: 'Hoopla'    // <- Your app_name
});