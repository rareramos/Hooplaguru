Invites = new Mongo.Collection('invites');

Invites.attachSchema(new SimpleSchema({
  firstName: {
    type: String,
    optional: true,
  },
  lastName: {
    type: String,
    optional: true,
  },
  email: {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
    optional: true,
    autoform: {
      type: 'email'
    }
  },
  phone: {
    type: String,
    regEx: SimpleSchema.RegEx.Phone,
    optional: true,
    autoform: {
      type: 'tel'
    }
  },
  twitterId: {
    type: String,
    optional: true,
  },
  inviteStatus: {
    type: String,
    optional: true,
    allowedValues: [
      'not invited',
      'no reply',
      'attending',
      'not attending',
    ],
  },
  hostRole: {
    type: String,
    optional: true,
  },
  isHost: {
    type: Boolean,
    optional: true,
    defaultValue: false,
  },
  bringingPlusOne: {
    type: Boolean,
    optional: true,
    defaultValue: false
  },
  mailStatus: {
    type: String,
    optional: true,
    defaultValue: 'not sent',
    allowedValues: ['not sent', 'sent', 'opened', 'bounced']
  },
  userId: {
    type: String,
    optional: true,
  },
  eventId: {
    type: String,
    optional: true,
  },
  groupId: {
    type: String,
    optional: true,
  },
  signInToken: {
    type: String,
    optional: true,
  },
  lastSeenWall: {
    type: Date,
    optional: true
  },
  isHidden: {
    type: Boolean,
    optional: true
  },
  isEnablePush: {
    type: Boolean,
    defaultValue: true,
    optional: true,
    label: 'Enable Push',
  },
  isSMSNotification: {
    type: Boolean,
    defaultValue: true,
    optional: true,
    label: 'SMS Notification',
  },
  isSyncCalendar: {
    type: Boolean,
    defaultValue: true,
    optional: true,
    label: 'Sync Calendar',
  },
  'notifycount': {
     type: String,
     optional: true,
     defaultValue: '0'
    }
}));

Invites.allow({
  insert (userId, doc){
    return Meteor.user().isHost(doc.eventId);
  },
  update (userId, doc){
    return true;
  },
});
