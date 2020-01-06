Params.eventId = (val, state, done) => {
  Session.set('importantPost', null);
  $('#wall-post-field').val('');

  if (state.added) {
    Session.set('prefetchEventId', val)
    Session.set('hideButtons', true);

      // set height of main slides
    Hoopla.setHeight({
      container: $(window),
      target: $('.swiper-container-short'),
      offsets: [],
      padding: 50
    });

    $('.ea_event-listing').velocity({opacity: [1, 0]}, {
      begin (els){
        $(els[0]).css({'z-index': 1});
      },
      complete (){
        Session.set('eventId', val);

        let eventId = val;

        Meteor.setTimeout(() => {
          Tracker.autorun(function(){
            Meteor.subscribe('posts', eventId, () => {
              Session.set('postSubscriptionReady', true);
              if(Session.get('walleventId') != eventId)
              {
                scrollToBottomNew();
                Session.set('walleventId', eventId);
              }
            });
          });
        }, 1);

        Meteor.subscribe('hosts', val);
        Meteor.subscribe('activities', val);

        Meteor.subscribe('event-images', eventId);
        Meteor.subscribe('guest-list', val);
        Meteor.subscribe('guest-list-v2', Meteor.userId());

       

        let invitesId = Invites.findOne({userId: Meteor.userId(), eventId: Session.get('eventId')});
          if(invitesId) {
            Meteor.subscribe('messages',Session.get('eventId'), invitesId._id);
          }
        let interval = setInterval(() => {
          if ($('.event-show-swiper')[0] && $('.event-show-swiper')[1]) {
            clearInterval(interval);

            Array.from($('.event-show-swiper')).forEach(el => {
              el.swiper.update();
              Hoopla.associateSwipers('.event-show-swiper');
              done();
            });

              // go to the currect event-nav page
            $('.event-show-swiper').get(0).swiper.slideTo(PM.get('event-nav') || 0);

              // set height of textfield for wall posts
            let form = $('#wall-post-field');
            //form.height(0);
            //form.height(form[0].scrollHeight);
          }

        }, Hoopla.defaultInterval);
      }
    });

  } else if (state.removed) {
    Session.set('hideButtons', null);
    Session.set('postLimit', null);

    $('.ea_event-listing').velocity({opacity: 0}, {complete (els){
      setTimeout(() => {
        $(els[0]).css({'z-index': -1});
        Session.set('eventId', null);
        Session.set('walleventId', null);
        Session.set('prefetchEventId', null);
        Session.set('postSubscriptionReady', null);
        Session.set('messagesRender',true);
        Utils.fixSafariCannotScroll('.ea_event-listing');
        done();
      }, 100);
    }});

  } else {
    Session.set('prefetchEventId', val)
    Session.set('eventId', val);
    done()
  }
};

var scrollToBottomNew = () => {
  if($('.new-msg-divider').length == 0)
  {
    Utils.scrollTo({
      target: $('.wall-collection-item:last'),
      container: $('.wall-posts-wrapper')
    });    
  }
  else
  {
    Utils.scrollTo({
      target: $('.new-msg-divider'),
      container: $('.wall-posts-wrapper')
    });  
  }

};
