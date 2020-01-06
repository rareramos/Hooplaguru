const addTimestamp = (userId, doc) => {
  const now = new Date();
  doc.createdAt = now;
  doc.updatedAt = now;
};

const updateTimestamp = (userId, doc) => {
  const now = new Date();
  doc.updatedAt = now;
};

let createPublicGroup = function(userId, doc){
  Groups.insert({
    eventId: this._id,
    name: 'Public',
    public: true,
    active: true,
  });
};

let createHostInvite = function(userId, doc){
  let user = Meteor.user();
  let { firstName, lastName, phone } = user.profile;

  Invites.insert({
    firstName,
    lastName,
    email: user.primaryEmail(),
    phone,
    userId,
    attending: true,
    isHost: true,
    inviteStatus: 'attending',
    hostRole: 'Host',
    eventId: this._id,
  });
};

let removeDependentDocuments = (userId, {_id}) => {
  
  Activities.remove({eventId: _id});
  Posts.remove({eventId: _id});
  Invites.remove({eventId: _id});
  Groups.remove({eventId: _id});
  CustomLocation.remove({eventId: _id});
  EventImages.remove({eventId: _id});
  Messages.remove({eventId: _id});

};

Events.before.insert(addTimestamp);
Events.after.insert(createPublicGroup);
Events.after.insert(createHostInvite);
Events.before.update(updateTimestamp);
Events.after.remove(removeDependentDocuments);
