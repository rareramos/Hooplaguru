Params.groupModal = (val, state, done) => {
  let modal = $('#group-modal');

  if (state.added) {
    modal.velocity({opacity: 1}, {begin (){
      modal.css({zIndex: 1});
    }, complete: done});
    formhackhide('group-limit-form');
  } else if (state.removed) {
    modal.velocity({opacity: 0}, {complete (){
      PM.set('group-id', null, true);
      modal.css({zIndex: -100});
      done();
    }});
    formhackshow();
  } else { done() }
};
