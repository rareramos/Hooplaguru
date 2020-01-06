Template.UseCoverPhoto.events({
  'click #choose-cover-photo-btn' () {
    let event = Events.findOne(Session.get('eventFormId'));
    let coverPhotoId = PhotoSwipe._singleton._getCurrentImageId()

    Events.update(event._id, {$set: {coverPhotoId}})

    PM.set('cover-photo-category', null);

    Meteor.setTimeout(() => {
      PM.set('cover-photo', null, true);
      Session.set('noCoverPhoto', null);
      PM.set('category-id', null, true);
      PhotoSwipe._singleton.close();
      Session.set('overlayTemplate', null);
    }, 250);
  },
});
