Template.PhotosPrompt.onCreated(function() {
  this.selectedEventImageIds = new ReactiveVar(new Set());
});

Template.PhotosPrompt.helpers({
  deletedtitle(){

    /*const titles = {
      'share': TAPi18n.__('photos.share_photos'),
      'delete': TAPi18n.__('photos.delete_photos'),
    };*/
    if(Template.instance().data.batchAction == TAPi18n.__('photos.delete')) {
      return TAPi18n.__('photos.delete_photos');
    }else{
      return TAPi18n.__('photos.share_photos');
    }
    
  },
  imagesByRows (){
    const event = Events.findOne({_id: Session.get('eventId')});

    if (! event) { return }
    if(!Meteor.user().isHost(Session.get('eventId')) && Template.instance().data.batchAction == TAPi18n.__('photos.delete'))
      return lodash.chunk(event.eventImagesOwn(Meteor.userId()), 3);
    else
      return lodash.chunk(event.eventImages(), 3);
  },

  shareCountText (){
    const shareCount = Template.instance().selectedEventImageIds.get().size;

    if (! shareCount) {
      return TAPi18n.__('photos.photos');

    } else if (shareCount === 1) {
      return TAPi18n.__('photos.photo1');

    } else {
      return `${shareCount} `+TAPi18n.__('photos.photomore');
    }
  },

  isSelected (){
    return Template.instance().selectedEventImageIds.get().has(this._id);
  }
});

Template.PhotosPrompt.events({
  'click .close-share' (event, template){
    PM.set(template.data.pmId, null);
  },

  'click .media-edit-wrapper' (evt, template){
    let selectedIds = template.selectedEventImageIds.get();
    let isSelected  = selectedIds.has(this._id);
    isSelected ? selectedIds.delete(this._id) : selectedIds.add(this._id);

    template.selectedEventImageIds.set(selectedIds);
  },

  'click .batch-action-btn' (event, template){
    const eventImageIds = template.selectedEventImageIds.get();

    if (! eventImageIds.size) { return }

    const {batchAction, pmId} = template.data;

    if (batchAction === TAPi18n.__('photos.share')) {
      const imageUrls = Array.from(eventImageIds).map(_id => {
        let eventImage = EventImages.findOne(_id);

        if(eventImage.isVideo == 1) {
          console.log($.cloudinary.url(eventImage.imageId, {resource_type: "video"}));
          return $.cloudinary.url(eventImage.imageId, {resource_type: "video"})+ ".mp4";
        } else {
          return $.cloudinary.url(eventImage.imageId) + ".png";  
        }
        
      });
     // console.log(imageUrls);
      Utils.shareImage(imageUrls, cleanUp);

    } else if (batchAction === TAPi18n.__('photos.delete')) {
      eventImageIds.forEach(function (_id) {
        
        let eventImage = EventImages.findOne(_id);
        if(eventImage.postId) {
          Meteor.call('deletePost', eventImage.postId);
        }

        CommentsList = Comments.find({imageId:eventImage.imageId}).fetch();
        CommentsList.forEach(function(comment) {
          Comments.remove(comment._id);
        });

        LikesList = Likes.find({imageId:eventImage.imageId}).fetch();

        LikesList.forEach(function(like) {
          Likes.remove(like._id);
        });
        //Comments.remove({imageId:eventImage.imageId});
        //Likes.remove({imageId:eventImage.imageId});
        EventImages.deletePhotos(eventImage);
        Meteor.call('deleteEventImages', _id);

        //EventImages.remove(_id);

      });

      cleanUp();
    }

    function cleanUp () {
      PM.set(pmId, null);
      template.selectedEventImageIds.set(new Set());
    }
  }
});
