Meteor.methods({
  'Activities.createNew' (eventId){
    check(eventId, String);

    return Activities.insert({eventId});
  },

  'Activities.update' (activityId, modifier){
    check(activityId, String);
    check(modifier, Object);

    return Activities.update({_id: activityId}, modifier);
  },
});
