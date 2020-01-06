Template.RsvpStepOne.helpers({
  text (){
    let status = Session.get('rsvpStatus');

    if (status === 'yes') {
      return {
        heading1: "Great! We can't wait", heading2: "to see you!",
        paragraph: "Enter the SMS code we just sent to access the event and send everyone a message!"
      };

    } else if (status === 'no') {
      return {
        heading1: "We're sorry", heading2: "you can't make it",
        paragraph: "But you can still join in the fun! We sent you a SMS code to follow the event."
      };

    } else {
      return {
        heading1: "That's cool, you don't", heading2: "have to commit now.",
        paragraph: "We sent you a SMS code to access the event and RSVP later."
      };
    }
  },
});

Template.RsvpStepOne.events({
  'click .rsvp-code-submit' (e){
    Utils.stopEvent(e);
    let code = Utils.numbers($('#code').val());

    if(!code) {
      return CrossPlatform.alert({msg: "Please enter confirmation code."});
    }
    Session.set('overlayTemplate', 'Loading');

    let phone = Session.get('rsvpUserPhone');
    
    if (! (code || phone)) { return }
      
    // try to open the app

    Meteor.call('loginByPhone', code, phone, (e, token) => {
      Session.set('overlayTemplate', null);

      if (e) {
        return CrossPlatform.alert({
          msg: 'Code not found. Please try again.',
          title: Hoopla.appName,
        });
      }

      Meteor.loginWithToken(token, (error) => {
        if (error) { CrossPlatform.alert({msg: error.message}) }
        const eventId = Session.get('rsvpEventId')

        if (Meteor.isCordova) {
          const eventPath = `/events?event-nav=0&event-id=${eventId}`

          return window.location.href = eventPath
        }

        const inviteId = PM.get('invite-id')

        if (inviteId) {
          return Meteor.call('Server.Sms.sendAppInviteLink',
            Meteor.userId(), {inviteId}, (err, inviteLink) => {

            Session.set('inviteLink', inviteLink)
            Session.set('rsvpTemplate', 'RsvpStepTwo');
          })

        } else if (eventId) {
           return Meteor.call('Server.Sms.sendAppInviteLink',
            Meteor.userId(), {eventId}, (err, inviteLink) => {

            Session.set('inviteLink', inviteLink)
            Session.set('rsvpTemplate', 'RsvpStepTwo');
          })
        }

        Session.set('rsvpTemplate', 'RsvpStepTwo');
      })
    });
  },
});

