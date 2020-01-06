Template.CommentsList.onCreated(function(){
  this.commentCharCount = new ReactiveVar(0);
  this.showCommentForm = new ReactiveVar(false);
  this.showComments = new ReactiveVar(true);

  this.autorun(() => {
    let showForm = Session.get('showCommentForm');
    this.showCommentForm.set(showForm);
  });
});

Template.CommentsList.helpers({
  showComments (){
    let overlayEnabled     = Session.get('enableCommentsOverlay');
    let shouldShowComments = Template.instance().showComments.get();
    let post               = postList();
    let hasComments        = post && post.comments().count();
    let haslike = Likes.find({imageId: Session.get('imageId')}).count(); 
    
    return (overlayEnabled || shouldShowComments) && (hasComments || haslike);
  },

  comments (){
    let post = postList();
    return post && post.comments();
  },

  likedImg(){
    let imageId;
    
    if(Session.get('imageId')) {
      imageId = Session.get('imageId');
    } else {
      imageId = EventImages.findOne({postId: Session.get('postId')}).imageId;
    }
    let like = Likes.findOne({imageId:imageId, userId: Meteor.userId()});
    return like ? true : false;
  },

  likeList (){
    let likelist = Likes.find({imageId: Session.get('imageId')},{sort: {createdAt: -1}});
    if(likelist && likelist.count() > 0) {
      user = Meteor.users.findOne({_id: likelist.fetch()[0].userId});

      let str = "";
      if (likelist.count() > 1) {
        let checkLike = Likes.findOne({userId: Meteor.userId(),imageId: Session.get('imageId')});
        if(checkLike) {
          str = "You and " + (likelist.count() - 1) + " other likes this.";
        } else {
          str = user.fullName() + " and " + (likelist.count() - 1) + " other likes this.";
        }
      } else if(likelist.count() == 1) {
        if(user._id == Meteor.userId()) {
          str = "You like this.";
        } else {
          str = user.fullName() + " like this.";
        }
      }
      return str;
    }
  },

  showCommentForm (){
    let showForm = Template.instance().showCommentForm.get();

    if (showForm) {
      setTimeout(() => {
        let textarea = $('#media-post-field');
        textarea.height(0);
        textarea.height(textarea[0].scrollHeight);
      }, 1);
    }

    return showForm;
  },

  hasCommentBody (){
    return Template.instance().commentCharCount.get();
  }
});

Template.CommentsList.events({
  'click .media-prompt-like' (evt, template){
    let imageId;
    
    if(Session.get('imageId')) {
      imageId = Session.get('imageId');
    } else {
      imageId = EventImages.findOne({postId: Session.get('postId')}).imageId;
    }
   likepic(imageId);
  },

  'click .media-prompt-comment' (evt, template){
    template.showCommentForm.set(true);
  },

  'click .media-prompt-share' (evt, template){
    let post = postList();
    let url = $.cloudinary.url(post.imageId);
    Utils.shareImage(url);
  },

  'keyup #media-post-field' (evt, template){
    let textarea = $('#media-post-field');
    template.commentCharCount.set(textarea.val().length);

    textarea.height(0);
    textarea.height(textarea[0].scrollHeight);
  },

  'click .post-form-submit' (){
    const textarea = $('#media-post-field');
    textarea.focus();

    let postId,imageId;
    if(Session.get('postId')) {
      postId = Session.get('postId');
      imageId = '';
    } else {
      imageId = Session.get('imageId');
      imgData = EventImages.findOne({imageId: Session.get('imageId')});
      if(imgData.postId) {
        postId = imgData.postId;
      } else {
        postId = '';
      }
    }
    let body = textarea.val()

    if (/^\s*$/.test(body)) {
      return
    }

    textarea.val('');
    textarea.height(0);
    textarea.height(textarea[0].scrollHeight);

    let comment = {
      body,
      postId,
      imageId,
      userId: Meteor.userId(),
    };

    Meteor.call('Comments.insert', comment);

    const msgBody = Meteor.user().profile.firstName + 
                   ` ` +
                   Meteor.user().profile.lastName + 
                   ` commented on #username# Photo. `
 
    if(postId == '') {
      postId = imageId;
    }
    Meteor.call('Server.Sms.sendCommentVer2', postId, Meteor.userId(), msgBody, (e, success) => {
       if (e) {
         CrossPlatform.alert({msg: e})
       }
    });

    scrollToBottom();
  },

  'click .collection.comments-collection' (evt, template){
    Session.set('enableCommentsOverlay', false);
    template.showComments.set(false);
  },

  'click .likeperson' (evt, template){
    evt.stopPropagation();
    let likelist = Likes.find({imageId: Session.get('imageId')},{sort: {createdAt: -1}});
    if(likelist.count() > 1) {
      let str = likelist.map(like => {
        user = Meteor.users.findOne({_id: like.userId});

        if(user._id == Meteor.userId()) {
          return 'You';
        } else {
          return user.fullName();
        }

      });
      lastPerson  = str.pop();
      $(evt.target).html(str.join(', ') + ' and '+ lastPerson + ' like this.');
    }
  }
});

const scrollToBottom = () => {
  Utils.scrollTo({
    target: $('#wall-post-bottom'),
    container: $('.comments-collection')
  });
};
