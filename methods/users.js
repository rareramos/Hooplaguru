Meteor.methods({
  'Users.update' (userId, modifier){
    check(userId, String);
    check(modifier, Object);

    return Meteor.users.update({_id: userId}, modifier);
  },
});
