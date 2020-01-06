const addTimestamp = (userId, doc) => {
  const now = new Date();
  doc.createdAt = now;
  doc.updatedAt = now;
};

const updateTimestamp = (userId, doc) => {
  const now = new Date();
  doc.updatedAt = now;
};

const formatName = (userId, doc) => {
  doc.firstName = Utils.capitalizeAll(doc.firstName);
  doc.lastName = Utils.capitalizeAll(doc.lastName);
};

const formatInsertedPhone = (userId, doc) => {
  if (! doc.phone) { return }
  const {phone} = doc

  doc.phone = Utils.stripUSCountryCode(phone)
}

const formatUpdatedPhone = (userId, doc, fieldNames, modifier) => {
  modifier.$set = modifier.$set || {}
  const {phone} = modifier.$set

  if (! phone) { return }

  modifier.$set.phone = Utils.stripUSCountryCode(phone)
}

const setLastSeenWall = (userId, doc) => {
  doc.lastSeenWall = new Date();
};

const createGroup = function(userId, {eventId, groupId, isHost}){
    // invite is being added to an existing group, so skip
  if (groupId) { return }

  const newGroup = {
    inviteId: this._id,
    eventId
  }

  if (isHost) {
    newGroup.active = true
  }

  Groups.insert(newGroup);
};

let setEventAttendingCount = (userId, doc) => {
  let event = Events.findOne(doc.eventId);

  if (! event) { return }

  let guestInvites = event.yesGuests().fetch();
  let plusOnes = _.select(guestInvites, invite => invite.bringingPlusOne);
  let totalAttendingCount = guestInvites.length + plusOnes.length;

  Events.update({_id: event._id}, {$set: {totalAttendingCount}})
};

let attachUserIdToHost = function(userId, doc){
  let { phone, email, firstName, lastName, isHost } = doc;

  if (! phone || ! isHost) { return }

  let existingUser = Meteor.users.findOne({
    'profile.phone': phone
  });

  if (existingUser) {
    doc.userId = existingUser._id;

  } else {
    let newUserId = LoginService.createUserViaInvite({
      phone, email, firstName, lastName,
    });

    doc.userId = newUserId;
  }
};

let removeGroup = function(userId, {_id}){
  Groups.remove({inviteId: _id});
};

let updateUserIdForInvitedGuest = function(userId, doc, fieldNames, modifier){
  if (! modifier.$set.phone) { return }
  if (modifier.$set.userId) { return }

  let {
    phone, email, firstName, lastName, isHost, inviteStatus
  } = {
    ...doc, ...modifier.$set,
  };

  if (
    isHost ||
    inviteStatus === 'not invited' ||
    ! inviteStatus
  ) { return }

  let existingUser = Meteor.users.findOne({
    'profile.phone': phone
  });

  if (existingUser) {
    modifier.$set.userId = existingUser._id;

  } else {
    let newUserId = LoginService.createUserViaInvite({
      phone, email, firstName, lastName,
    });

    modifier.$set.userId = newUserId;
  }
};

let updateUserIdForHost = function(userId, doc, fieldNames, modifier){
  if (lodash.get(modifier, '$set.isHost')) {
    modifier.$set.inviteStatus = 'attending';
  }

  if (! modifier.$set.phone) { return }

  let {
    phone, email, firstName, lastName, isHost, inviteStatus
  } = {
    ...doc, ...modifier.$set,
  };

  if (! isHost) { return }

  let existingUser = Meteor.users.findOne({
    'profile.phone': phone
  });

  if (existingUser) {
    modifier.$set.userId = existingUser._id;

  } else {
    let newUserId = LoginService.createUserViaInvite({
      phone, email, firstName, lastName,
    });

    modifier.$set.userId = newUserId;
  }
};

Invites.before.insert(addTimestamp);
Invites.before.insert(formatName);
Invites.before.insert(formatInsertedPhone);
Invites.before.insert(setLastSeenWall);
Invites.after.insert(createGroup);

Invites.before.update(updateTimestamp);
Invites.before.update(formatName);
Invites.before.update(formatUpdatedPhone);
Invites.after.update(setEventAttendingCount);

Invites.after.remove(setEventAttendingCount);
Invites.after.remove(removeGroup);

if (Meteor.isServer) {
  Invites.before.insert(attachUserIdToHost);

  Invites.before.update(updateUserIdForHost);
  Invites.before.update(updateUserIdForInvitedGuest);
}
