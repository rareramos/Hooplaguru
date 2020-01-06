Template.ImagePostLink.events({
  'click .image-post-link' (){
    PM.set('image-id', this.post.imageId);
    this.post.initPhotoSwipe();
  },
});

Template.ImagePostLink.helpers({
  checkPostType (){
  	
    let getImageData = EventImages.findOne({_id: this.post._id});
    return (getImageData && getImageData.isVideo == 1) ? TAPi18n.__('wall.video') : TAPi18n.__('wall.photo');
  },
});
