Comments = new Mongo.Collection('comments');

Comments.attachSchema(new SimpleSchema({
  body: {
    type: String
  },
  postId: {
    type: String,
    optional: true
  },
  imageId: {
    type: String,
    optional: true
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
  },
  userId: {
    type: String
  },
}));

Comments.helpers({
  username (){
    let user = Meteor.users.findOne({_id: this.userId});

    return user && user.fullName();
  },

  timeAgoPosted (){
    return moment(this.createdAt).fromNow();
  },

  isComment() {
    return true;
  }
});

Comments.allow({
  remove(userId, doc) {
    return Events.findOne(doc.eventId).isHost(userId) || doc.userId == userId;
  },
})
