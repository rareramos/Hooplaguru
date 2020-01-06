EventImages.before.insert(function (userId, doc) {
  doc.userId = userId;
})

if (Meteor.isServer) {
  EventImages.after.insert(function (userId, doc) {
    let {_id, eventId} = doc;
    let previousEventImageIds = Events.findOne(eventId).eventImageIds;
    let eventImageIds = _.union(previousEventImageIds, [_id]);
    Events.update(eventId, {$set: {eventImageIds}})
  })
}

EventImages.after.remove((userId, doc) => {
  if (! Events.findOne(doc.eventId)) { return }

  // delete eventImage attached to this post
  Comments.remove({imageId: doc.imageId});
  Likes.remove({imageId: doc.imageId});
});