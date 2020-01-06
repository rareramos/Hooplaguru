Template.RsvpStepTwo.helpers({
  text (){
    let status = Session.get('rsvpStatus');
    let defaults = {
      paragraph: 'We just sent a download link to your phone. To experience all the features of this event like photo sharing, the Event Wall, and notifications from the host, download HooplaGuru for FREE!',
    };

    if (status === 'yes') {
      return {
        heading1: "Great! We can't wait",
        heading2: "to see you!",
        ...defaults,
      };

    } else if (status === 'no') {
      return {
        heading1: "We're sorry",
        heading2: "you can't make it",
        ...defaults,
      };

    } else {
      return {
        heading1: "That's cool, you don't",
        heading2: "have to commit now.",
        ...defaults,
      };
    }
  },

  appStoreUrl (){
    const inviteLink = Session.get('inviteLink')
    return inviteLink || Hoopla.appStoreUrl
  },

  googlePlayUrl (){
    const inviteLink = Session.get('inviteLink')
    return inviteLink || Hoopla.googlePlayUrl
  },
});

Template.RsvpStepTwo.onDestroyed(() => {
  Session.set('inviteLink', null)
})
