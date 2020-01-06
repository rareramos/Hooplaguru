Params.hostInviteId = (val, state, done) => {
  Session.set('hostInviteId', (val || null));
  done();
};
