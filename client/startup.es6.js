Meteor.startup(() => {

  
	var online = navigator.onLine;
 
  if(navigator.userAgent.match(/(iPad|iPhone|iPod)/g)) {
    if(!online)
    {
      CrossPlatform.alert({msg: "You Are Offline And Some Functionality Will Not Be Available"});  
    } 
  } 

  Push.setBadge(0);
  Push.addListener('startup', function(notification) {
    PM.set('event-id', notification.payload.eventId);
    PM.set('event-nav',null);
    PM.set('event-nav', 1, true);
  });
  
   // Configure our notification
 Push.Configure({
   android: {
     senderID: 211069606366,
     alert: true,
     badge: true,
     sound: true,
     vibrate: true,
     clearNotifications: true
     // icon: '',
     // iconColor: ''
   },
   ios: {
     alert: true,
     badge: true,
     sound: true
   }
 });
 
  Push.addListener('message', function(notification) {
    // Called on every message
    function alertDismissed() {
      NotificationHistory.update({_id: notification.payload.historyId}, {
        $set: {
          "recievedAt": new Date()
        }
      });
    }
    alert(notification.message, alertDismissed, notification.payload.title, "Ok");
  });

  Tracker.autorun(function() {
    var user = Meteor.user();
    if (!user) return;

    mixpanel.identify(user._id);

    person = {
      "Name": user.profile.firstName + ' ' + user.profile.lastName,

      // special mixpanel property names
      "$first_name": user.profile.firstName,
      "$last_name": user.profile.lastName,
      "$email": user.primaryEmail(),
      "$phone": user.phone.number
    }

    mixpanel.people.set(person);
  });

  Meteor.subscribe('events-images-blank',function(){
    //EventImages.remove({eventId:PM.get('event-id'),imageId: {$exists : false}});
    var allEventImage = EventImages.find({imageId: {$exists : false}}).fetch();

  if(allEventImage.length > 0) {
    allEventImage.forEach(function(image) {
      EventImages.remove(image._id);
    });
  }
  });
  



  if (! Meteor.isCordova) { return }

  facebookConnectPlugin.activateApp(function(){
    console.log("App activation Successful.");
  },function(err){
    console.log("App activation error." + err);
  })



  let screenUnlockable = device &&
    screen.lockOrientation &&
    screen.unlockOrientation

  if (screenUnlockable) {
    if (/iPhone/i.test(device.model)) {
      screen.lockOrientation('portrait');

    } else if ($(window).width() <= 500) {
      screen.lockOrientation('portrait');

    } else {
      screen.unlockOrientation();
    }
  }

    //branch.io
  const {ENABLE_ANALYTICS, BRANCH_API_KEY} = Meteor.settings.public

  if (! ENABLE_ANALYTICS) { return }

  branch.setDebug(true);

  const branchInit = () => {
    branch.init(BRANCH_API_KEY, {isReferrable: true}, (error, data) => {
      console.log(data);
      if (error) { return console.log('branch init error', error) }
      console.log("Branch Success");
      const {data_parsed} = data
      const shouldRoute = (
        data_parsed &&
        data_parsed['+clicked_branch_link'] &&
        data_parsed.$deeplink_path
      )
      console.log(shouldRoute);
      if (shouldRoute) {
        return routeBranchIncoming(data_parsed)
      }
    });
  }

  branchInit();
  document.addEventListener('resume', branchInit, false);
});

const routeBranchIncoming = (data_parsed) => {
  console.log("Routing Started");
  console.log(data_parsed);
  const redirectUrl = Meteor.absoluteUrl(data_parsed.$deeplink_path)
  const successHandler = {onSuccess (callback){
    analytics.track('clicked branch link', data_parsed, callback)
  }}

  const hasLoginToken = s.include(data_parsed.$deeplink_path, 'login-token')

  if (hasLoginToken) {
    Utils.loginAndRedirect(redirectUrl, successHandler)

  } else {
    successHandler.onSuccess(() => {
      const absolutePath = redirectUrl.replace(/^https?:\/\/[^/]+/, '');
      window.location.href = absolutePath
    })
  }
}

