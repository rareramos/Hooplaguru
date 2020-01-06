Params.activityId = (val, state, done) => {
  Session.set('activityId', (val || null));
  done();
};
