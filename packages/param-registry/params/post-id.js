Params.postId = (val, state, done) => {
  if (state.removed) {
    Session.set('postId', null);
    Session.set('showComments', null);
  } else {
    Session.set('postId', val);
    Session.set('imageId', null);
    Session.set('showComments', true);
  }

  done();
};
