Params.addGuestsFileModal = (val, state, done) => {
  let modal = $('#add-guests-file-modal');
  
  if (state.added) {
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
          $('#addFileList'),
        ],
        padding: 110 // clears the initially not rendered .add-guest-btn-wrapper-collection div
      });
    done();
  } else if (state.removed) {
    
    modal.velocity({opacity: 0}, {complete (){

      modal.css({zIndex: -100});

      done();
    }});
    formhackshow();
  } else { done() }
};  