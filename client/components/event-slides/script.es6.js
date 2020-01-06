Template.EventSlides.helpers({
  eventSlideTemplate (){
    let eventId = Session.get('eventId');

    if (eventId) {
      return Meteor.user().isHost(eventId) ? 'GuestList' : 'EventsShowRsvp';
    }
  }
});
