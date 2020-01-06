Params.rsvpYes = (val, state, done) => {
  var eventId = Session.get('eventId');
  var guest;

  if (state.added && eventId) {
    guest = Invites.findOne({user: Meteor.userId(), event: eventId});

    if (! guest.previousYes && ! guest.wallName) {
      Meteor.call('tryBotChatRsvp', {
        event: eventId,
        body: Hoopla.bot.guestYesPrompt,
        createdAt: new Date()
      }, guest, {promptName: true});

    } else if (! guest.previousYes && guest.wallName) {
      Meteor.call('tryBotChatRsvp', {
        event: eventId,
        body: `Hey everyone! ${guest.wallName}'s coming! This is gonna be great!`,
        createdAt: new Date()
      }, guest);
    }
  }

  done();
};
