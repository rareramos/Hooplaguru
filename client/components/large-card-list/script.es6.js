Template.LargeCardList.onRendered(function(){
  this.find('.bounce-scroll-slide')._uihooks = {
    insertElement (node, next){
      $(node)
        .insertBefore(next)
        .velocity('fadeIn', {duration: 1000})
    }
  };
});

Template.LargeCardList.events({
  'click .event-card' (){
    $("#mySidenav").css("width","0");
    PM.set('event-id', this._id);
    $(".event-back-btn").css('z-index','2');
  },
});
