Template.PhotoSwipe.onCreated(() => {
  Session.set('enableCommentsOverlay', true);
});

Template.PhotoSwipe.helpers({
  photoSwipeOverlay (){
    return Session.get('photoSwipeOverlay');
  },
});

Template.PhotoSwipe.events({
  'click .pswp__scroll-wrap' (evt){
    Utils.stopEvent(evt);
    Session.set('enableCommentsOverlay', true);
  },
});

Template.PhotoSwipe.onDestroyed(() => {
  Session.set('enableCommentsOverlay', false);
});
