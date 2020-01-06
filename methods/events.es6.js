Meteor.methods({
  'Events.createNew' (){
    if (! Meteor.user()) { return }

    let event = {
      creating: true,
      isPlusOne: true,
    };

    return Events.insert(event);
  },

  'Events.update' (eventId, modifier){
    check(eventId, String);
    check(modifier, Object);

    if (Meteor.user().isHost(eventId)) {
      return Events.update({_id: eventId}, modifier);
    }
  },

  'Events.remove' (eventId){
    check(eventId, String);

    if (Meteor.user().isHost(eventId)) {
      return Events.remove({_id: eventId});
    }
  },
});
