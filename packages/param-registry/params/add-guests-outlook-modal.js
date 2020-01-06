Params.addGuestsOutlookModal = (val, state, done) => {
  let modal = $('#add-guests-outlook-modal');
  if (state.added) {
    modal.css("display","block");
    Session.set('outlookRenderd', true);
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
    Session.set('outlookRenderd', false);
    modal.velocity({opacity: 0}, {complete (){

      modal.css({zIndex: -100});

      done();
    }});

  } else { done() }
};  