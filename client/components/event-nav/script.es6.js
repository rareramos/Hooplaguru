Template.EventNav.helpers({
  navLinkText (){
    let eventId = Session.get('eventId');

    if (!eventId) {
      return;

    } else if (Meteor.user().isHost(eventId)) {
      return TAPi18n.__('event_nav.guests');

    } else {
      return TAPi18n.__('event_nav.rsvp');
    }
  },
});