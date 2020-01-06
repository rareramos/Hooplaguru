Params.invitePreview = (val, state, done) => {
  if (state.added) {
    $('.ea_events-list').css("-webkit-filter", "blur(20px)");
    $('.ea_event-listing').css("-webkit-filter", "blur(15px)");
    Session.set('overlayTemplate', 'InvitePreview');

    formhackhide('all');

  } else if (state.removed) {
    $('.ea_events-list').css("-webkit-filter", "blur(0px)");
    $('.ea_event-listing').css("-webkit-filter", "blur(0px)");
    Session.set('overlayTemplate', null);

    formhackshow();
  }

  done();
};
