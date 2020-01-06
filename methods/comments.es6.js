Meteor.methods({
  'Comments.insert' (comment){
    check(comment, Object);

    const commentId = Comments.insert(comment)
    let post;
    if(comment.postId && comment.postId != '') {
      post = Posts.findOne({_id: comment.postId});
    } else {
      post = EventImages.findOne({imageId: comment.imageId});
    }
    const eventId = post.eventId;
    const invite = Invites.findOne({
      userId: comment.userId,
      eventId: post.eventId
    });

    const savedComment = Comments.findOne({_id: commentId});

    Meteor.call('Invites.update', invite._id, {$set: {
      lastSeenWall: savedComment.createdAt
    }});

    return commentId;
  },
});
