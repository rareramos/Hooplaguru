ProfileSchema = new SimpleSchema({
  firstName: {
    type: String,
    optional: true,
  },
  lastName: {
    type: String,
    optional: true,
  },
  phone: {
    type: String,
    optional: true,
    autoform: {
      type: 'tel'
    }
  },
  sourceName: {
    type: String,
    optional: true
  },
  sourceId: {
    type: String,
    optional: true
  },
  'notifyflag': {
    type: Boolean,
    optional: true,
    defaultValue: true
  },
  'notifycount': {
     type: String,
     optional: true,
     defaultValue: '0'
    },
  'userLang': {
     type: String,
     optional: true,
    }
});

Meteor.users.attachSchema(new SimpleSchema({
  username: {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
    optional: true
  },
  emails: {
    type: [Object],
    optional: true
  },
  "emails.$.address": {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
    optional: true,
    autoform: {
      type: 'email'
    }
  },
  "emails.$.verified": {
    type: Boolean,
    optional: true
  },
  createdAt: {
    type: Date,
    optional: true
  },
  profile: {
    type: ProfileSchema,
  },
  services: {
    type: Object,
    optional: true,
    blackbox: true
  },
  roles: {
    type: [String],
    defaultValue: []
  },
  phone: {
    type: Object,
    defaultValue: {},
    optional: true,
  },
  'phone.number': {
    type: String,
    optional: true
  }
}));

Meteor.users.helpers({
  hasSourceInfo (){
    return this.profile.sourceName && this.profile.sourceId
  },

  fullName (){
    return this.profile.firstName + ' ' + this.profile.lastName;
  },

  primaryEmail (){
    return (
      this.emails &&
      this.emails[0] &&
      this.emails[0].address
    );
  },

  identifier (){
    if (this.profile.fullName) {
      return this.profile.fullName;

    } else {
      return this.emails[0].address;
    }
  },

  hasEvent (eventId, inviteId){
    return Invites.findOne({userId: this._id, eventId, _id: inviteId});
  },

  isHost (eventId){
    if (! eventId) { return }

    const invite = Invites.findOne({userId: this._id, eventId});

    return invite && invite.isHost
  },

  isEventGuest (eventId){
    return _.contains(Events.findOne(eventId).invites, Invites.findOne({"user": this._id, "event": eventId})._id);
  },

  hasPushEnabled (){
    return Push.appCollection.findOne({userId: this._id});
  },

  lastSeenWall (eventId){
    const invite = Invites.findOne({
      userId: this._id,
      eventId
    });

    return invite && invite.lastSeenWall;
  },

});

Meteor.users.findByPhone = phone => {
  return Meteor.users.findOne({'profile.phone': phone});
};

Meteor.users.findOrCreateViaInvite = (phone, invite, {sendCode} = {}) => {
  let user = Meteor.users.findByPhone(phone);

  if (! user) {
    return LoginService.createUserViaInvite(invite, {sendCode});
  }

  if (sendCode) {
    LoginService.sendLoginCode(user._id, invite.phone);
  }

  return user._id
};

const formatInsertedPhone = (userId, doc) => {
  if (! doc.phone || ! doc.phone.number) { return }

  const {number} = doc.phone
  const formattedNumber = Utils.stripUSCountryCode(number)

  doc.phone.number = formattedNumber
  doc.profile.phone = formattedNumber
}

const formatUpdatedPhone = (userId, doc, fieldNames, modifier) => {
  if (! modifier.$set) { return }
  const {phone, profile} = modifier.$set

  let formattedNumber

  if (phone && phone.number) {
    formattedNumber = Utils.stripUSCountryCode(phone.number)

  } else if (profile && profile.phone) {
    formattedNumber = Utils.stripUSCountryCode(profile.phone)

  } else { return }

  modifier.$set.phone = phone || {}
  modifier.$set.phone.number = formattedNumber

  modifier.$set.profile = profile || {}
  modifier.$set.profile.phone = formattedNumber
}

Meteor.users.before.insert(formatInsertedPhone)
Meteor.users.before.update(formatUpdatedPhone)
