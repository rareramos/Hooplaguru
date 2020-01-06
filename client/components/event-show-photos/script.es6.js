Template.EventsShowPhotos.onCreated(function(){
  this.formActivityFilter = new ReactiveVar('All');
  Session.set('totalimageuploadcount','0');

});

Template.EventsShowPhotos.onRendered(function(){
  this.find('.event-media-wrapper')._uihooks = {
    insertElement (node, next){
      $(node)
      .hide()
      .insertBefore(next)
      .velocity('fadeIn');
    },
  };
});

Template.EventsShowPhotos.helpers({
  imagesByRows (){
    if (! this.currentEvent) { return [] }
    var filterIds = Template.instance().formActivityFilter.get();
    let images = this.currentEvent.eventImagesWithFilter(filterIds);
    return lodash.chunk(images, 3);
  },

  shouldShowDelete (){
    if (! this.currentEvent) { return }

    const isHost = this.currentEvent.isHost(Meteor.userId());
    const hasImages = this.currentEvent.eventImages().length;
    const hasOwnImages = this.currentEvent.eventImagesOwn(Meteor.userId()).length > 0;
    return (isHost || hasOwnImages) && hasImages
  },

  shouldShowShare (){
    if (! this.currentEvent) { return }

    const hasImages = this.currentEvent.eventImages().length
    return Meteor.isCordova && hasImages
  },

  likesCount (){
    if(this.imageId)
    {
      let like = Likes.find({imageId:{$exists: true},imageId: this.imageId});
    
      if(like) {
        return like.count();
      } else {
        return 0;
      }
    } else {
      return 0;
    }
  },

  commentsCount(){

    if(this._id) {
      let img = EventImages.findOne({_id: this._id});
      if(img && img.comments()) {
        return img.comments().count();
      } else {
        return 0;
      }
    } else {
      return 0;
    }

  },

  likedImg(){
    let like = Likes.findOne({imageId: this.imageId,userId: Meteor.userId()});
    return like ? true : false;
  },

  checkphone(){
    return Meteor.isCordova;
  },

  eventActivities() {
    let activityList = Activities.find({eventId:Session.get('eventId'), creating:false}).fetch();
    return activityList;
  },

  s2Opts: function () {
    return [
      {label: "2013", value: 2013},
      {label: "2014", value: 2014},
      {label: "2015", value: 2015}
    ];
  },

  files() {
    
    var cloudinaryData = Cloudinary.collection.find();
    let parcentage = 0;
    cloudinaryData.forEach((data) => { 
      parcentage = parcentage + data.percent_uploaded;
    });
    let roundPer = Math.round(parcentage / 2);
    console.log(roundPer);

    if(roundPer == 100) {
      
    }
  }

});

Template.EventsShowPhotos.events({
  // 'change #event-photos-form input[type="file"]' (event, template){
  //   EventImages.insertFromFiles(
  //     event.currentTarget.files,
  //     Session.get('eventId'),
  //   )
  //   const photosForm = document.getElementById('event-photos-form')
  //   photosForm.reset();

  //   return mixpanel.track("Photo Uploaded.");
  // },

  'click #add-media' (evt,template){
    PM.set('event-add-media', true);
  },

  'click #share-photos' (evt, template){
    PM.set('share-prompt', true);
  },

  'click #delete-photos' (evt, template){
    PM.set('delete-prompt', true);
  },

  'click .media-tile-image' (event){
    openPhotoswipe(event);
  },

  'click .like-pic' (event){
    imageId = $(event.target).attr('data-id');
    likepic(imageId);
  },

  'click .cmnt-pic' (event){
    PM.set('show-comment-form', true);
    openPhotoswipe(event);
  },

  'change #activity-select' (event, template){

    var filetId = template.find('#activity-select').value;
    template.formActivityFilter.set(filetId);
  }

});

const openPhotoswipe = (event) => {
  let images  = Events.findOne(Session.get('eventId')).eventImages();
  let imageId = $(event.target).attr('data-id');
  let index   = lodash.findIndex(images, {imageId});

  PM.set('image-id', imageId);
  PhotoSwipe.initPhotoSwipe(images, {index,overlayTemplate: 'CommentsList',
    isClickableElement (el){
      return el.tagName === 'TEXTAREA';
    },
  });
}