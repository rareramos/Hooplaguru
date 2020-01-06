Params.mediaActivityId = (val, state, done) => {
  if (state.added) {
    Session.set('mediaActivityId', val);

  } else if (state.removed) {
    Session.set('mediaActivityId', null);
  }

  done();
};
