Params.guestId = (val, state, done) => {
  if (state.added) {
    Session.set('selectedGuestId', val)

  } else if (state.removed) {
    Session.set('selectedGuestId', null);
  }

  done();
};
