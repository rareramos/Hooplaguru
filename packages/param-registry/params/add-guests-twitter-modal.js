Params.addGuestsTwitterModal = (val, state, done) => {
    let modal = $('#add-guests-twitter-modal');

  if (state.added) {
    modal.css("display","block");
    Session.set('twitterRenderd', true);
    modal.velocity({opacity: 1}, {begin (){
      
      modal.css({zIndex: 1});

      done();

    }, complete (){
        
    }});

    Hoopla.setHeight({
        container: $(window),
        target: $('.contacts-collection'),
        offsets: [
          $('#add-guest-fixed-header'),
        ],
        padding: 110 // clears the initially not rendered .add-guest-btn-wrapper-collection div
      });

  } else if (state.removed) {
    modal.css("display","none");
    Session.set('twitterRenderd', false);

    modal.velocity({opacity: 0}, {complete (){

      modal.css({zIndex: -100});

      done();
    }});

  } else { done() }
};  