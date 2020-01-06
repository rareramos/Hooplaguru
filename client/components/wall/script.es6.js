let isAtBottom = true;

Template.Wall.onCreated(function(){

  this.wallPostCharCount = new ReactiveVar();
  this.userHasInteracted = new ReactiveVar(false);
  this.seeingWall = new ReactiveVar(false);
  Session.set( "userHasInteracted", false );

  this.autorun(() => {
    const slideIndex = Session.get('eventNav');

    if (slideIndex !== '1') {
      setLastSeeWall.call(this);
      this.seeingWall.set(false);
      this.userHasInteracted.set(false);
    } else {
      this.seeingWall.set(true);
    }
  });
});

Template.Wall.onRendered(function(){
  //let debouncedScroll = _.debounce(scrollToBottom, 500)

  this.find('.wall-posts-wrapper')._uihooks = {
    insertElement (node, next){
      $(node)
        .velocity({opacity: 0}, {display: 'block', easing: "ease-in-out", duration: 0})
        .insertBefore(next)
        .velocity({opacity: 1}, {display: 'block', easing: "ease-in-out"});

      isAtBottom;
    },
  };

  let announcements = Posts.find({
    createdAt:        {$gt: new Date()},
    hostAnnouncement: true,
  })

  announcements.observe({
    added ({body, eventId, userId}){
      const shouldNotifyUser = (
        (Session.get('eventId') === eventId) &&
        (Session.get('eventNav') !== '1') &&
        (Meteor.userId() !== userId)
      );

      if (shouldNotifyUser) {
        const user = Meteor.users.findOne({_id: userId});

        CrossPlatform.alert({
          msg: `${user.fullName()} says: ${body}`,
          title: 'Host Announcement',
          buttonText: 'Dismiss'
        });
      }
    }
  });

  let debouncedCheckIsAtBottom = _.debounce(function () {
    Meteor.setTimeout(function () {
      isAtBottom = Utils.isElementInViewport($('#wall-post-bottom'))
    }, 500)
  }, 100)

  $('.wall-posts-wrapper').on('scroll', debouncedCheckIsAtBottom);

  $(".wall-posts-wrapper").animate({
                    scrollTop:  $('.wall-posts-wrapper').prop("scrollHeight")
                  });

});

Template.Wall.helpers({
  userHasInteracted (){
    return Template.instance().userHasInteracted.get() || Session.set( "userHasInteracted");
  },

  postSubscriptionReady (){
    return Session.get('postSubscriptionReady');
  },

  wallContents (){
    const eventId = Session.get('eventId')
    const lastSeenWall = Meteor.user().lastSeenWall(eventId);
    const posts = Posts.find({eventId}).fetch();
    const imgs = EventImages.find({eventId:eventId, postId: {$exists: false}}).fetch();
    const comments = _(posts)
      .map(post => post.comments().fetch())
      .flatten(true)
      .value()

  // posts.forEach(function(post){
  //   console.log(post.comments().fetch());
  // })

    // const imgcomments = _(imgs)
    //   .map(img => img.comments().fetch())
    //   .flatten(true)
    //   .value()
    let imgArray = [];
    imgs.forEach(function(img){
      if(img && img.comments())
      {
        let imgsA = img.comments().fetch();
        //imgArray.push(imgsA);
        imgsA.forEach(function(imgSub){
          if(imgSub.createdAt)
          {
            imgArray.push(imgSub);
          }
        })
      }
    })

    const [seen, unseen] = _(posts.concat(comments).concat(imgArray))
      .sortBy('createdAt')
      .partition(content => content.createdAt <= lastSeenWall)
      .value();
    return {seen, unseen};
  },

  hasPostBody (){
    return Template.instance().wallPostCharCount.get();
  },

  importantIconSrc (){
    let eventId = Session.get('eventId');
    let formHasText = Template.instance().wallPostCharCount.get();
    let postIsImportant = Session.get('importantPost');

    if (Meteor.user().isHost(eventId)) {
      if (formHasText && postIsImportant) {
        return '/icons/icon-announce-active@2x.png';
      } else {
        return '/icons/icon-announce-inactive@2x.png';
      }
    }
  },

});

Template.Wall.events({
  'keyup #wall-post-field' (evt, template){
    const textarea = $('#wall-post-field');

    template.wallPostCharCount.set(textarea.val().length);

    textarea.height(0);
    textarea.height(textarea[0].scrollHeight);
  },

  'click .toggle-importance' (){
    const textarea = $('#wall-post-field');
    textarea.focus();

    const status = Session.get('importantPost');

    Session.set('importantPost', (! status));
  },

  'click .load-more-btn-container' (){
    let currentLimit = Session.get('postLimit');
    Session.set('postLimit', (currentLimit + 50));
  },  

  'click .post-form-submit' (evt, template){

    const textarea = $('#wall-post-field');
    if(textarea.val() == ''){ return;}
    textarea.focus();

    let post = {
      eventId: Session.get('eventId'),
      body: textarea.val(),
      hostAnnouncement: (Session.get('importantPost') || false),
    };

    template.userHasInteracted.set(true);

    Meteor.call('Posts.insert', post, (e, success) => {
      if (e) {
        CrossPlatform.alert({msg: e})
      }
    });

    const fetchedEventId = Session.get('eventId');

    const body = Meteor.user().profile.firstName +
                   ` posted on Wall : "` + textarea.val() +
                   `". `
     Meteor.call('Server.Sms.sendWallpostVer2', fetchedEventId, Meteor.userId(), (Session.get('importantPost') || false), body, (e, success) => {
       if (e) {
         CrossPlatform.alert({msg: e});
       }
    });

    textarea.val('');
    textarea.height(0);
    textarea.height(textarea[0].scrollHeight);

    template.wallPostCharCount.set(0);
    Session.set('importantPost', false);

    scrollToBottom();
  },

  'change #wall-photos-upload' (event){
    uploadWallPostMedia(event);
  },

  'change #wall-videos-upload' (event){
    uploadWallPostMedia(event);
  }
});

const uploadWallPostMedia = function(event){

  var postMsg = $("#wall-post-field").val();
  Session.set('wallPostBody', postMsg);

  EventImages.insertFromFiles(
      event.target.files,
      Session.get('eventId'),null,'wall',
      (_id, blobImage) => {

        Session.set('wallPostId', _id);
        if(blobImage)
        {
          // PhotoSwipe.initPhotoSwipe(blobImage, {
          //   overlayTemplate: 'PreviewWallUpload',
          //   isClickableElement (element){
          //     return element.tagName === 'TEXTAREA';
          //   },
          // });
          
          let eventId          = Session.get('eventId');
          let body             = postMsg;
          let hostAnnouncement = false;
          
          //PhotoSwipe.closePhotoSwipe();
          //scrollToBottom();
        
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
                  scrolled= $(".wall-post-collection").height();
                  
                  $(".wall-posts-wrapper").animate({
                    scrollTop:  $('.wall-posts-wrapper').prop("scrollHeight")
                  });
                  //alert("Pic Uploaded");
                  if (error) {
                    CrossPlatform.alert({msg: error.message});
                  }
                }
              )
              
              const fetchedEventId = Session.get('eventId');
              const body = Meteor.user().profile.firstName +
                             ` posted Photo on Wall.`
               Meteor.call('Server.Sms.sendWallpostVer2', fetchedEventId, Meteor.userId(), false, body, (e, success) => {
                 if (e) {
                   CrossPlatform.alert({msg: e})
                 }
               });
            }
          )
        }
        else
        {
          let eventId = Session.get('eventId');
          let body = postMsg;
          let hostAnnouncement = false;
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
              }
            )
        } 
      }
    );




    const wallPostForm = document.getElementById('wall-post-form')
    wallPostForm.reset();
};
const scrollToBottom = () => {
  Utils.scrollTo({
    target: $('#wall-post-bottom'),
    container: $('.wall-posts-wrapper')
  });
};

const scrollToBottomPic = () => {
  // Utils.scrollTo({
  //   target: $('#wall-post-bottom'),
  //   container: $('.wall-post-collection')
  // });

  scrolled= $(".wall-post-collection").height();
  $(".wall-post-collection").animate({
    scrollTop:  scrolled
  });

};

const setLastSeeWall = function(){
  if (! this.seeingWall.get()) { return }

  const invite = Invites.findOne({
    userId: Meteor.userId(),
    eventId: Session.get('eventId')
  });

  Meteor.call('Invites.update', invite._id, {$set: {
    lastSeenWall: new Date()
  }});
};