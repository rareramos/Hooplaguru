Meteor.startup(() => {
  Activities._ensureIndex({eventId: 1});

  Groups._ensureIndex({eventId: 1});

  Comments._ensureIndex({postId: 1});

  Invites._ensureIndex({userId: 1});
  Invites._ensureIndex({isHost: 1, eventId: 1});

  Posts._ensureIndex({eventId: 1});
});
