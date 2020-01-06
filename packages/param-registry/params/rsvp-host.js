Params.rsvpHost = (val, state, done) => {
  var eventId = Session.get('eventId');
  var guest;

  if (state.added && eventId) {
    guest = Invites.findOne({user: Meteor.userId(), event: eventId});

    if (guest && guest.isHost && (! guest.wallName)) {
      Meteor.call('tryBotChatRsvp', {
        event: eventId,
        body: Hoopla.bot.hostPrompt,
        createdAt: new Date()
      }, guest, {promptName: true});
    }
  }

  done();
};
