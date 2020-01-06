Posts = new Mongo.Collection('posts');

Posts.attachSchema(new SimpleSchema({
  eventId: {
    type: String
  },
    // can be Meteor.user or bot
  userId: {
    type: String
  },
    // is reply to another post; post can only be replied to if it has media
  body: {
    type: String,
    optional: true,
    autoform: {
      afFieldInput: {
        type: 'textarea'
      }
    }
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
  hostAnnouncement: {
    type: Boolean,
    defaultValue: false,
  },
}));

Posts.helpers({
  importantPost (){
    return (
      this.hostAnnouncement || this.userId === Hoopla.bot.defaultName
    );
  },

  image (){
    return EventImages.findOne({postId: this._id});
  },

  // client only
  initPhotoSwipe() {
    const postImage = this.image();
    let photoSwipeImage;

    if (Session.get('blobImage')) {
      photoSwipeImage = Session.get('blobImage');
    } else {
      photoSwipeImage = postImage;
    }

    PhotoSwipe.initPhotoSwipe(photoSwipeImage, {
      overlayTemplate: 'CommentsList',
      isClickableElement (el){
        return el.tagName === 'TEXTAREA';
      },
    })
  },

  timeAgoPosted (){
    return moment(this.createdAt).fromNow();
  },

  username (){
    if (this.userId === Hoopla.bot.defaultName) {
      return Hoopla.bot.defaultName;

    } else if (this.hostAnnouncement) {
      return Hoopla.wall.hostTitle;

    } else {
      let user = Meteor.users.findOne({_id: this.userId});

      return user && user.fullName();
    }
  },

  canBeDeleted (userId){
    let user = Meteor.users.findOne({_id: userId});

    return (user.isHost(this.eventId)) || (this.userId === userId);
  },

  comments (){
    return Comments.find({postId: this._id});
  },

  commentCount (){
    return this.comments().count();
  },

  getEmailAnnouncementData (){
    let event = Events.findOne({_id: this.eventId});

    let {
      eventTitle,
      eventTime,
      locationName,
      addressPart1,
      addressPart2,
      addressPart3,
      eventLink
    } = event.generateMailData();

    let hostName = Meteor.users.findOne({_id: this.userId}).fullName();
    let { body: hostAnnouncement } = this;

    return {
      hostName,
      hostAnnouncement,
      eventTitle,
      eventTime,
      locationName,
      addressPart1,
      addressPart2,
      addressPart3,
      eventLink
    };
  }
});

Posts.getPushAnnouncementData = ({
  title = 'Host Announcement', body, userIds, route = 'event', eventId
}) => ({
  title,
  text: `\u2B50 Host says: ${body}`,
  query: {userId: {$in: userIds}},
  payload: {
    route,
    eventId
  }
});

Posts.before.insert((userId, doc) => {
  if (doc.userId === Hoopla.bot.defaultName) { return }

  doc.userId = userId;
})

Posts.after.insert((userId, doc) => {
  if (! Events.findOne(doc.eventId)) { return }

  let postsCount = Posts.find({eventId: doc.eventId}).count();

  Meteor.call('Events.update', doc.eventId, {$set: {postsCount}});
});

Posts.after.remove((userId, doc) => {
  if (! Events.findOne(doc.eventId)) { return }

  // update post count
  let postsCount = Posts.find({eventId: doc.eventId}).count();
  Meteor.call('Events.update', doc.eventId, {$set: {postsCount}});

  // delete eventImage attached to this post
  EventImages.remove({postId: doc._id});
});

Posts.allow({
  insert(userId, doc) {
    return Events.findOne(doc.eventId).isGuest(userId);
  },
})
