Meteor.methods({
  'Invites.insertHost' ({hostRole = 'Host', ...fields}){
    if (! Meteor.user()) { return }

    let hostInvite = {
      ...fields,
      hostRole,
      isHost: true,
      inviteStatus: 'not invited',
    };

    return Invites.insert(hostInvite);
  },

  'Invites.insert' (eventId, inviteOrMultiple){
    
    check(eventId, String);
    check(inviteOrMultiple, Match.OneOf(Object, Array));
    
    if (! Meteor.user().isHost(eventId)){
      throw new Meteor.Error('not authorized');
    }

    let invites = inviteOrMultiple;
    
    if (! _.isArray(inviteOrMultiple)) {
      invites = [inviteOrMultiple];
    }
    invites.forEach(invite => {
      // clean invite before insert
      invite._id = '';
      invite.inviteStatus = invite.inviteStatus || 'not invited';
      return Invites.insert(invite);
    });
  },

  'Invites.update' (inviteId, modifier){
    check(inviteId, String);
    check(modifier, Object);

    if (modifier.$set.phone) {
      modifier.$set.phone = Utils.numbers(modifier.$set.phone);
    }

    return Invites.update({_id: inviteId}, modifier);
  },

  'Invites.remove' (inviteId, eventId){
    check(inviteId, String);
    check(eventId, String);

    if (Meteor.user().isHost(eventId)) {
      if (Invites.findOne(inviteId).userId === this.userId) {
        throw new Meteor.Error(
          'can not remove yourself',
          'You can not remove yourself as a host.'
        );
      } else {
        return Invites.remove({_id: inviteId});
      }
    } else if (Meteor.user().hasEvent(eventId, inviteId)) {
      return Invites.remove({_id: inviteId});

    } else {
      throw new Meteor.Error('not authorized to remove guests',
        'Only the planner can remove a guest from the guest list.'
      );
    }
  }
});
