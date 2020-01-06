Template.PreviewWallUpload.onCreated(function(){
  this.markedImportant = new ReactiveVar(false);
});

Template.PreviewWallUpload.onRendered(function(){

  setTimeout(() => {
    let textarea = $('#media-post-field');
    textarea.height(0);
    textarea.height(textarea[0].scrollHeight);
  }, 1);
});

Template.PreviewWallUpload.helpers({
  canMarkImportant (){
    let eventId = Session.get('eventId');

    return Meteor.user().isHost(eventId);
  },

  markedImportant (){
    return Template.instance().markedImportant.get();
  },

  postWallUploadPreDifine (){
    if (Session.get('importantPost')) {
       $(".toggle-importance").attr('src','/icons/icon-announce-active@2x.png');
       Template.instance().markedImportant.set(true);
    } 
    return Session.get('wallPostBody');
  },
});

Template.PreviewWallUpload.events({
  'keyup #media-post-field' (){
    let textarea = $('#media-post-field');
    textarea.height(0);
    textarea.height(textarea[0].scrollHeight);
  },

  'click .toggle-importance' (evt, template){
    const textarea = $('#media-post-field');
    textarea.focus();

    let status = template.markedImportant.get();

    template.markedImportant.set(! status);
  },

  'click .post-form-submit' (evt, template){
    let eventId          = Session.get('eventId');
    let body             = $('#media-post-field').val();
    let hostAnnouncement = template.markedImportant.get();
    Session.set( "userHasInteracted", true );
    PhotoSwipe.closePhotoSwipe();
    scrollToBottom();

    Posts.insert(
      {eventId, body, hostAnnouncement},
      function(error, postId) {
        if (error) {
          CrossPlatform.alert({msg: error});
          return
        }

        EventImages.update(
          {_id: Session.get('wallPostId')}, { $set: {postId} },
          function(error) {
            if (error) {
              CrossPlatform.alert({msg: error.message});
            }
          }
        )

        const fetchedEventId = Session.get('eventId');
        const body = Meteor.user().profile.firstName +
                       ` posted Photo on Wall.`
         Meteor.call('Server.Sms.sendWallpostVer2', fetchedEventId, Meteor.userId(), (template.markedImportant.get()), body, (e, success) => {
           if (e) {
             CrossPlatform.alert({msg: e})
           }
         });
      }
    )
    Session.get('importantPost',false);
    Session.get('wallPostBody',null);
  },
});

const scrollToBottom = () => {
  Utils.scrollTo({
    target: $('#wall-post-bottom'),
    container: $('.wall-post-collection')
  });
};
