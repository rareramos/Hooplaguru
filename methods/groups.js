Meteor.methods({
  'Groups.update' (_id, modifier){
    check(_id, String);
    check(modifier, Object);

    return Groups.update({_id}, modifier);
  },
});
