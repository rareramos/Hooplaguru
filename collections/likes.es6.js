Likes = new Mongo.Collection('likes');

Likes.attachSchema(new SimpleSchema({
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

Likes.allow({
  remove(userId, doc) {
    return Events.findOne(doc.eventId).isHost(userId) || doc.userId == userId;
  },
})