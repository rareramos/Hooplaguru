Params.rsvpNo = (val, state, done) => {
  var eventId = Session.get('eventId');
  var guest;

  if (state.added && eventId) {
    guest = Invites.findOne({user: Meteor.userId(), event: eventId});

    if (! guest.previousYes && ! guest.wallname) {
      Meteor.call('tryBotChatRsvp', {
        event: eventId,
        body: Hoopla.bot.guestNoPrompt,
        createdAt: new Date()
      }, guest, {promptName: true});

    } else if (! guest.previousYes && guest.wallName) {
      Meteor.call('tryBotChatRsvp', {
        event: eventId,
        body: `${guest.wallName} can't make it :( What can we do to change ${guest.wallName}'s mind?`,
        createdAt: new Date()
      }, guest);
    }
  }

  done();
};
