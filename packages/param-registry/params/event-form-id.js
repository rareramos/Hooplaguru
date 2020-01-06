Params.eventFormId = (val, state, done) => {
  if (val) {
    Meteor.subscribe('hosts', val);
    Meteor.subscribe('cover-photo-categories');
    Meteor.subscribe('activities', val);
  }

  Session.set('eventFormId', (val || null));
  done();
};
