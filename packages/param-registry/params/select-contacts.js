Params.selectContacts = (val, state, done) => {
  if (state.added) {
    Session.set('overlayTemplate', 'SelectContacts');

  } else if (state.removed) {
    Session.set('overlayTemplate', 'AddGuests');
  }

  done();
};
