Params.mediaId = (val, state, done) => {
  if (state.removed) {
    Session.set('mediaId', null);

  } else {
    Session.set('mediaId', val);
  }

  done();
};
