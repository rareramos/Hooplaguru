Messages = new Mongo.Collection('messages');

Messages.attachSchema(new SimpleSchema({
  toUser: {
    type: [String],
  },
  fromUser: {
    type: String,
  },
  eventId: {
    type: String
  },
  message: {
    type: String,
  },
  readStatus: {
    type: [String],
    optional: true
  },
  parentMsgId: {
    type: String
  },
  conversationId: {
    type: String
  },
  createdAt: {
    type: Date,
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return {$setOnInsert: new Date()};
      } else {
        this.unset();
      }
    }
  }
}));
Messages.helpers({
  timeAgoPosted (){
    return moment(this.createdAt).fromNow();
  },
});
