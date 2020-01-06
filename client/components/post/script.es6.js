Template.Post.helpers({
  isDeletable (){
    if(this._id) {
      return this.canBeDeleted(Meteor.userId());
    } else {
      return false;
    }
  },

  commentPrompt (count){
    if (! count) { return TAPi18n.__('wall.comment'); }
    if (count === 1) { return count +' '+TAPi18n.__('wall.comment'); }

    return count +' '+TAPi18n.__('wall.comment');
  },

  likesCount (){
    if(this.image().imageId)
    {
      let like = Likes.find({imageId:{$exists: true},imageId: this.image().imageId});
      if(like) {
        return like.count() +' '+TAPi18n.__('wall.like');;
      } else {
        return 0 +' '+TAPi18n.__('wall.like');;
      }
    } else {
      return 0 +' '+TAPi18n.__('wall.like');;
    }
  },

  likedImg(){
    let like = Likes.findOne({imageId: this.image().imageId,userId: Meteor.userId()});
    return like ? true : false;
  },
  
});

Template.Post.events({
  'click .delete-post' (){

    let eventImage = EventImages.findOne({postId:this._id});
    
    if(eventImage) {
      EventImages.deletePhotos (eventImage);
    }
    Meteor.call('deletePost', this._id);
  },

  'click .post-prompt.share' (){
    let url;
    if(this.image().isVideo == 1) {
      url = $.cloudinary.url(this.image().imageId, {resource_type: "video"})+ ".mp4";
    } else {
      url = $.cloudinary.url(this.image().imageId) + ".png";  
    }
    
    Utils.shareImage(url);
  },

  'click .post-prompt.comment' (){
    PM.set('post-id', this._id);
    PM.set('show-comment-form', true);
    Posts.findOne(this._id).initPhotoSwipe();
  },

  'click .post-prompt.likes' (){
    likepic(this.image().imageId);
  },

  // NOTE: the cotext of this callback is under Image component
  'click .wall-post-image' (){
    
    PM.set('post-id', this.postId);
    Posts.findOne(this.postId).initPhotoSwipe();
  },
});
