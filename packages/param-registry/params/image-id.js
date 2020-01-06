Params.imageId = (val, state, done) => {
  if (state.removed) {
    Session.set('imageId', null);
    Session.set('showComments', null);
  } else {
    Session.set('imageId', val);
    Session.set('showComments', true);
  }

  done();
};