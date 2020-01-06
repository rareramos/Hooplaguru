Hoopla = {
  appName: 'HooplaGuru',
  Params: {},
  animDuration: 300,
  keyupDebounce: 250,
  scrollDelay: 200,
  defaultInterval: 100,
  parallaxOffset: -100,
  toastInterval: 3000,
  nearbyResultsRadius: 5000, // in meters
  velocityDuration: 300,
  fadeOutDelay: 1250,
  siteName: 'HooplaGuru',
  welcomeFadeOutDelay: 5000,
  photoSwipeSize: 1000,

  urlScheme: {
    base: 'eventassistmeteor://',
  },

  timeZones: {
    eastern: 'America/New_York',
    central: 'America/Chicago',
    mountain: 'America/Denver',
    pacific: 'America/Los_Angeles'
  },

  email: {
    //from: 'hoopla@hoopla.social',
    from: 'events@hooplaguru.com',
  },

  inviteUrl (token){
    return Meteor.absoluteUrl() + 'invite/' + token;
  },

  smsInviteUrl (phone, code, eventId){
    return `${Meteor.absoluteUrl()}sms-invite/${phone}/${code}/${eventId}`;
  },

  bot: {
    defaultName: 'Event Bot',
    hostPrompt: "[Your Name] is hosting! This is gonna be great!",
    guestYesPrompt: "Hey everyone! [Your Name]'s coming! This is gonna be great!",
    guestNoPrompt: "[Your Name] can't make it :( What can we do to change [Your Name]'s mind?"
  },

  wall: {
    hostTitle: 'Host Announcement'
  },

  isEmail (input){
    return SimpleSchema.RegEx.Email.test(input);
  },

  isPhone (input){
    return SimpleSchema.RegEx.Phone.test(input);
  },

  processWidth: 2000,
  processHeight: 2000,
  processQuality: .75,

  loginSmsText: 'Your HooplaGuru login code is: [code].',

  groupBaseUrl: 'app.hooplaguru.com/',
  appStoreUrl: 'https://itunes.apple.com/us/app/hooplaguru-your-event-guru/id1040219905?mt=8',
  googlePlayUrl: 'https://play.google.com/store/apps/details?id=com.id1wv7fg61nhcof01rhqsd',

  haveBeenWalkedThrough: {
    get() {
      return window.localStorage.getItem('HOOPLA_HAVE_BEEN_WALKED_THROUGH')
    },
    set() {
      return window.localStorage.setItem('HOOPLA_HAVE_BEEN_WALKED_THROUGH', true)
    }
  },
};
