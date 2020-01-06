Params.addGuestsEventsModal = (val, state, done) => {
    let modal = $('#add-guests-events-modal');
  if (state.added) {
    $("#add-guests-events-modal").css("display","block");
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
          $('#guests-events-row-custom'),
        ],
        padding: 130 // clears the initially not rendered .add-guest-btn-wrapper-collection div
      });

    Meteor.subscribe('guest-list', Meteor.userId());
    formhackhide('all', 0, 1);

  } else if (state.removed) {
    $("#add-guests-events-modal").css("display","none");  
    modal.velocity({opacity: 0}, {complete (){

      modal.css({zIndex: -100});

      done();
    }});

    formhackshow();
    
  } else { done() }
};  