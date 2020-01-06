Template.Event.onCreated(() => {
  Session.set({
    rsvpTemplate: 'EventDetails',
    overlayTemplate: null,
    rsvpEventId: null,
  });
});

Template.Event.helpers({
  rsvpTemplate (){
    return Session.get('rsvpTemplate');
  },

  overlayTemplate (){
    return Session.get('overlayTemplate');
  },
  checkisVideo() {

    if(this.event) {
      if(this.event.isVideo == 1) {
        return true;
      } else {
        return false;
      }
    }
  }
});

Template.Event.events({
  
  'click #rsvp-yes' (e, template){    

    if(!Meteor.isCordova && Meteor.Device.isPhone()) {

      if(navigator.userAgent.match(/(iPad|iPhone|iPod)/g)) {
        new Confirmation({
          message: "Please install the App to accept the invitation. Would you like to install the App?",
          title: "",
          cancelText: "Cancel",
          okText: "Yes",
          success: true, 
          focus: "cancel" 
        }, function (ok) {
            if(ok) {
              window.location = Hoopla.appStoreUrl;
            }
        });
        return false;
      } else {
        new Confirmation({
          message: "Please install the App to accept the invitation. Would you like to install the App?",
          title: "",
          cancelText: "Cancel",
          okText: "Yes",
          success: true, 
          focus: "cancel" 
        }, function (ok) {
            if(ok) {
              window.location = Hoopla.googlePlayUrl;
            }
        });
        return false;
      }
    }
    
    let {
      firstName,
      lastName,
      phone
    } = AutoForm.getFormValues('rsvp-form').insertDoc;

    let buttons = ['#rsvp-yes', '#rsvp-no', '#decide-later'];

    if (firstName && lastName && Utils.numbers(phone).length >= 10) {
      //calendarSyncEvent(true,template.data.event);

      handleRsvpForm({
        template,
        rsvpStatus: 'yes',
        props: {inviteStatus: 'attending'},
      });
    } else if(!firstName) {
      CrossPlatform.alert({msg: TAPi18n.__('guests.valid_firstname')})
    } else if(!lastName) {
      CrossPlatform.alert({msg: TAPi18n.__('guests.valid_lastname')})
    } else if(Utils.numbers(phone).length < 10) {
      CrossPlatform.alert({msg: TAPi18n.__('guests.valid_phone')})
    }
  },

  'click #rsvp-no' (e, template){

    if(!Meteor.isCordova && Meteor.Device.isPhone()) {

      if(navigator.userAgent.match(/(iPad|iPhone|iPod)/g)) {
        new Confirmation({
          message: "Please install the App to accept the invitation. Would you like to install the App?",
          title: "",
          cancelText: "Cancel",
          okText: "Yes",
          success: true, 
          focus: "cancel" 
        }, function (ok) {
            if(ok) {
              window.location = Hoopla.appStoreUrl;
            }
        });
        return false;
      } else {
        new Confirmation({
          message: "Please install the App to accept the invitation. Would you like to install the App?",
          title: "",
          cancelText: "Cancel",
          okText: "Yes",
          success: true, 
          focus: "cancel" 
        }, function (ok) {
            if(ok) {
              window.location = Hoopla.googlePlayUrl;
            }
        });
        return false;
      }
    }

    let {
      firstName,
      lastName,
      phone
    } = AutoForm.getFormValues('rsvp-form').insertDoc;

    let buttons = ['#rsvp-yes', '#rsvp-no', '#decide-later'];

    if (firstName && lastName && Utils.numbers(phone).length >= 10) {
      handleRsvpForm({
        template,
        rsvpStatus: 'no',
        props: {inviteStatus: 'not attending'},
      });
    } else if(!firstName) {
      CrossPlatform.alert({msg: TAPi18n.__('guests.valid_firstname')})
    } else if(!lastName) {
      CrossPlatform.alert({msg: TAPi18n.__('guests.valid_lastname')})
    } else if(Utils.numbers(phone).length < 10) {
      CrossPlatform.alert({msg: TAPi18n.__('guests.valid_phone')})
    }
  },

  'click #decide-later' (e, template){
    let {
      firstName,
      lastName,
      phone
    } = AutoForm.getFormValues('rsvp-form').insertDoc;

    let buttons = ['#rsvp-yes', '#rsvp-no', '#decide-later'];

    if (firstName && lastName && Utils.numbers(phone).length >= 10) {
      handleRsvpForm({
        template,
        rsvpStatus: 'maybe',
        props: {inviteStatus: 'no reply'},
      });
    } else if(!firstName) {
      CrossPlatform.alert({msg: TAPi18n.__('guests.valid_firstname')})
    } else if(!lastName) {
      CrossPlatform.alert({msg: TAPi18n.__('guests.valid_lastname')})
    } else if(Utils.numbers(phone).length < 10) {
      CrossPlatform.alert({msg: TAPi18n.__('guests.valid_phone')})
    }
  },

  'click .event-show-image .vide-play-image' (e, template){

    e.stopPropagation();
    e.preventDefault();
    var curretIds = this.event._id;
    
    var myVideo = $(".event-details-preview #videoElements_"+this.event._id)[0];

    myVideo.onpause = function() {
      $(".event-details-preview #img_"+curretIds).prop('src',"/images/icon-play.png");
    };

    if (myVideo.paused) {
      myVideo.play();
      $(".event-details-preview #img_"+this.event._id).prop('src',"/images/icon-pause.png");  
    }
    else { 
      myVideo.pause(); 
      $(".event-details-preview #img_"+this.event._id).prop('src',"/images/icon-play.png");  
    } 
  },

});

Template.Event.onDestroyed(() => {
  Session.set({
    rsvpTemplate: null,
    overlayTemplate: null,
    rsvpUserPhone: null,
    rsvpEventId: null
  });
});

let handleRsvpForm = ({template, rsvpStatus, props}) => {
  let {
    firstName,
    lastName,
    phone
  } = AutoForm.getFormValues('rsvp-form').insertDoc;

  let {_id: eventId} = template.data.event;
  let {_id: groupId} = template.data.group;

  let countryCode;
  if($("#countryCode").val() == '+1' || PM.get('phone')) {

    countryCode = '';
  } else {

    countryCode = Utils.numbers($("#countryCode").val());  
  }

  let guestInvite = {
    firstName,
    lastName,
    phone: Utils.numbers(countryCode+phone) || Meteor.user().profile.phone,
    eventId,
    groupId,
    ...props,
  };

  let inviteId = PM.get('invite-id');

  if (inviteId) {
    guestInvite = {
      ...guestInvite, _id: inviteId
    };
  }

    // we can pretend the link is from sms if we are logged in to the app, since
    // we have access to the user's phone number
  let linkIsFromSMS = PM.get('sign-in-token') || (
    Meteor.isCordova && Meteor.user()
  )

  Session.set('rsvpEventId', eventId)
  Session.set('overlayTemplate', 'Loading');
  Meteor.call('Server.Invites.register', guestInvite, linkIsFromSMS, (e, userId) => {
    Session.set('overlayTemplate', null);

    if (e) {
      return CrossPlatform.alert({
        msg: e.error,
        title: Hoopla.appName,
      });
    }

    // Do not let user download the app if the user is in the app
    if (! Meteor.isCordova) {
      Session.set({
        rsvpTemplate: linkIsFromSMS ? 'RsvpStepTwo' : 'RsvpStepOne',
        rsvpStatus,
        rsvpUserPhone: Utils.numbers(guestInvite.phone),
      });
    }

    if (userId && Meteor.isCordova) {
      if (Meteor.userId()) {
        const eventPath = `/events?event-nav=0&event-id=${eventId}`
        return window.location.href = eventPath

      } else {
          // if we are coming from an email there is no sign-in-token
        if (! PM.get('sign-in-token')) {
          return Session.set({
            rsvpTemplate: 'RsvpStepOne',
            rsvpStatus,
            rsvpUserPhone: Utils.numbers(guestInvite.phone),
          });

        } else {
          return navUserToEvent(userId, eventId)
        }
      }
    }

    if (userId && linkIsFromSMS) {
      if (! Meteor.isCordova) {
        Meteor.call('Server.Sms.sendAppInviteLink', userId, {eventId})
      }

      navUserToEvent(userId, eventId)

    } else if (Meteor.isCordova) {
      // when the user use email link in the app, he does not have a token
      // we navigate the user to home screen
      Meteor.userId() ? Router.go('/events') : Router.go('/')
    }
  });
};

const navUserToEvent = function(userId, eventId){
  Session.set('overlayTemplate', 'Loading');

  Meteor.call('Server.Invites.getUserTokenFromInviteToken',
    userId, PM.get('invite-id'), PM.get('sign-in-token'), (e, token) => {

    if (e) { return CrossPlatform.alert({msg: e.message}) }

    let path = `/events?event-nav=0&event-id=${eventId}&login-token=${token}`;

    if (! Meteor.isCordova) {
      Session.set('overlayTemplate', null);
      return Utils.openApp(path);
    }

    Utils.loginAndRedirect(path, {onSuccess (callback){
      const userNeedsSource = Meteor.user() && (
        ! Meteor.user().hasSourceInfo()
      )

      if (! userNeedsSource) {
        Session.set('overlayTemplate', null);
        return callback()
      }

      analytics.identify(Meteor.userId(), {traits: {
        sourceName: 'invite',
        sourceId: eventId
      }}, () => {
        Meteor.call('Users.update', Meteor.userId(), {$set: {
          'profile.sourceName': 'invite',
          'profile.sourceId': eventId
        }}, () => {
          Session.set('overlayTemplate', null);
          callback()
        })
      })
    }})
  })
}

