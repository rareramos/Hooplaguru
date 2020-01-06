Params.groupId = (val, state, done) => {
  Session.set('groupId', (val || null));
  done();
};
