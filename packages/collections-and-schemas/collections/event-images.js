EventImages = new Mongo.Collection('event-images');

EventImages.attachSchema(new SimpleSchema({
  imageId: {
    type: String,
    optional: true,
  },
  eventId: {
    type: String,
  },
  userId: {
    type: String,
  },
  blob: {
    type: String,
    optional: true,
  },
  orientation: {
    type: Number,
    defaultValue: 0,
    optional: true,
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
  postId: {
    type: String,
    optional: true
  },
  width: {
    type: Number,
  },
  height: {
    type: Number,
  },
  isVideo: {
    type: Number,
    defaultValue: 0,
    optional: true,
  },
  activityId: {
    type: [String],
    optional: true
  },
  posterId: {
    type: String,
    optional: true,
  },
  uploadStatus: {
    type: Boolean,
    optional: true,
  },
}));

EventImages.helpers({
  comments (){
    if(this.postId && this.imageId) {
      return Comments.find({$or:[{imageId: this.imageId}, {postId: this.postId}]});
    } else if(this.imageId){
      return Comments.find({imageId: this.imageId});
    } else {
      return false;
    }
  },
  username (){
    let user = Meteor.users.findOne({_id: this.userId});
    return user && user.fullName();
  },
  initPhotoSwipe() {
    let photoSwipeImage;

    if (Session.get('blobImage')) {
      photoSwipeImage = Session.get('blobImage');
    } else {
      photoSwipeImage = this;
    }

    PhotoSwipe.initPhotoSwipe(photoSwipeImage, {
      overlayTemplate: 'CommentsList',
      isClickableElement (el){
        return el.tagName === 'TEXTAREA';
      },
    })
  },
});

EventImages.allow({
  insert(userId, doc) {
    return Events.findOne(doc.eventId).isGuest(userId);
  },
  update(userId, doc) {
    return Events.findOne(doc.eventId).isGuest(userId);
  },
  remove(userId, doc) {
    return Events.findOne(doc.eventId).isHost(userId) || doc.userId == userId;
  }
})
