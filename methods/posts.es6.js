Meteor.methods({
  'Posts.insert' (post, uploadId){
    check(post, {
      eventId: String,
      body: String,
      hostAnnouncement: Boolean,
    });

    check(uploadId, Match.Optional(String));

    post.userId = Meteor.userId();
    post.createdAt = new Date();

    const invite = Invites.findOne({
      userId: post.userId,
      eventId: post.eventId
    });

    const postId = Posts.insert(post);
    const savedPost = Posts.findOne({_id: postId});

    Meteor.call('Invites.update', invite._id, {$set: {
      lastSeenWall: savedPost.createdAt
    }});

    if (post.hostAnnouncement) {
      let event = Events.findOne({_id: post.eventId});
      let postDoc = Posts.findOne({_id: postId});
      let mailData = postDoc.getEmailAnnouncementData()

      Meteor.call('Server.Posts.sendAnnouncements',
        postDoc, event, mailData
      );
    }

    return postId;
  },
});
