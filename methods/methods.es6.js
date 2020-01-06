Meteor.methods({
  deleteActivity (activityId, eventId){
    check(activityId, String);
    check(eventId, String);

    if (Meteor.user().isHost(eventId)) {
      Activities.remove({_id: activityId});
    } else {
      throw new Meteor.Error('not authorized');
    }
  },

  rsvpReply (eventId, guest, reply){

    check(eventId, String);
    check(guest, Object);
    check(reply, Object);

    let guestId = guest._id ||
      Invites.findOne({userId: guest.userId, eventId: eventId})._id

    let guestModifier = {
      $set: {
        plusOne: false,
        inviteStatus: reply.rsvp ? "attending" : "not attending"
      }
    };

    Meteor.call('Invites.update', guestId, guestModifier);
  },

  updateGuest (guestId, update){
    check(guestId, String);
    check(update, Object);

    Invites.update({_id: guestId}, update);
  },

  deletePost (postId){
    check(postId, String);

    var post = Posts.findOne(postId);
    
    if (this.userId && post.canBeDeleted(this.userId)) {
      Posts.remove({_id: post._id});
      Comments.remove({postId: post._id});
    } else {
      throw new Meteor.Error('not authorized');
    }
  },

  deleteEventImages (imageId){
    EventImages.remove(imageId);
  },

  setLastSeenPost (eventId, time){
    check(eventId, String);
    check(time, Date);

    var guest, event;

    if (this.userId) {
      guest = Invites.findOne({event: eventId, user: this.userId});

      if (guest) {
        Invites.update({_id: guest._id}, {$set: {lastSeenWall: time}});
      }

    } else {
      throw new Meteor.Error('not authorized');
    }
  },

  findGuestForContact (contact){
    check(contact, Object);

    let guest = Invites.findOne({
      email: {$in: (contact.emails || [])}
    });

    return guest;

  },

});
