Template.Group.onCreated(function(){
  this.resendingInvite = new ReactiveVar(false);
  this.resendButtonText = new ReactiveVar(TAPi18n.__('guests.group.resend_invite'));
  this.inviteForGroup = new ReactiveVar();  

  this.autorun(() => {
    const {inviteId} = Groups.findOne({_id: Session.get('groupId')}) || {};
    const invite = Invites.findOne({_id: inviteId});

    this.inviteForGroup.set(invite);
  });
});

Template.Group.helpers({
  groupModalTitle (){
    const {name} = Groups.findOne({_id: Session.get('groupId')}) || {};
    const invite = Template.instance().inviteForGroup.get();

    if (name) {
      return name;

    } else {
      return invite && invite.fullName();
    }
  },

  group (){
    return Groups.findOne({_id: Session.get('groupId')});
  },

  showGuestOptions (){
    const invite = Template.instance().inviteForGroup.get()
    if (! invite) { return }

    const group = Groups.findOne({_id: invite.groupId})
    if (! group) { return }

    const {userId, inviteStatus, mailStatus} = invite

    return (
      (group.active) &&
      (userId !== Meteor.userId()) &&
      (inviteStatus !== 'not invited' || mailStatus !== 'not sent')
    )
  },

  showUninvite (){
    const invite = Template.instance().inviteForGroup.get()
    if (! invite) { return }

    const group = Groups.findOne({_id: invite.groupId})
    if (! group) { return }

    return (
      (! group.public) &&
      (invite.userId !== Meteor.userId())
    )
  },

  activeGroup (){
    let group = Groups.findOne({_id: this.groupId});

    if (group){
      if (group.active === true){
        return group;
      }
    }
  },

  nonSelfInvite (){
    const invite = Template.instance().inviteForGroup.get()
    if (! invite) { return }

    if (invite.userId !== Meteor.userId()) {
      return invite;
    }
  },

  inviteSent (){
    return (
      this.inviteStatus !== 'not invited' ||
      this.mailStatus !== 'not sent'
    )
  },

  resendingInvite (){
    return Template.instance().resendingInvite.get();
  },

  resendButtonText (){
    let instance = Template.instance();
    let text = instance.resendButtonText.get();

    if (text === 'invite resent') {
      Meteor.setTimeout(() => {
        instance.resendButtonText.set(TAPi18n.__('guests.group.resend_invite'))
      }, 2000);
    }

    return text;
  },

  toggleButtonText (){
    const {isHidden} = Template.instance().inviteForGroup.get() || {};

    if (isHidden) {
      return TAPi18n.__('guests.group.show_guest_list');

    } else {
      return TAPi18n.__('guests.group.hide_guest_list');
    }
  },

  toggleHostText (){
    const invite = Template.instance().inviteForGroup.get() || {}
    return invite.isHost ? TAPi18n.__('guests.group.remove_cohost') : TAPi18n.__('guests.group.add_cohost')
  },
  groupHeaderLeft (){
    return TAPi18n.__('guests.group.done');
  },

  groupLimitTitle (){
    return TAPi18n.__('guests.group.guest_limit');
  },

  firstnameTitle (){
    return TAPi18n.__('guests.firstname');
  },
  lastnameTitle (){
    return TAPi18n.__('guests.lastname');
  },
  emailTitle (){
    return TAPi18n.__('guests.email');
  },
  numberTitle (){
    return TAPi18n.__('guests.phone');
  },
});

Template.Group.events({
  'click #toggle-hide-guest' (evt, template){
    const invite = template.inviteForGroup.get()
    Invites.toggleHidden(invite);
  },

  'click .close-group' (){
    let groupId = Session.get('groupId');
    let limit = $('#limit').val();

    Meteor.call('Groups.update', groupId, {$set: {limit}});
    PM.set('group-modal', null);
  },

  'click #delete-guest-btn' (){
      let group = Groups.findOne({_id: Session.get('groupId')});

      Meteor.call('Invites.remove', group.inviteId, group.eventId);
      PM.set('group-modal', null);
    },

  'click #share-group-url' (){
    loadingtext($(event.target));
    let url = Groups.findOne({_id: Session.get('groupId')}).url;
    if(Meteor.isCordova) {
      Utils.shareMessage(url);
    } else {
      window.prompt("Press Ctrl+C to copy invitation URL.", url);
    }
  },

  'click #toggle-host' (evt, template){
    const invite = template.inviteForGroup.get();
    const modifier = {$set: {
      isHost: !invite.isHost,
      hostRole: invite.isHost ? '' : 'Co-Host'
    }};

    if (modifier.$set.isHost) {
      modifier.$set.isHidden = false;
    }

    Meteor.call('Invites.update', invite._id, modifier);
    PM.set('group-modal', null);
  },

  'click #resend-invite-btn' (evt, template){
    template.resendingInvite.set(true);

    let group = Groups.findOne({_id: Session.get('groupId')});
    let inviteIds = [group.inviteId];

    Meteor.call('Server.Invites.sendMultiple', inviteIds, (e, result) => {
      template.resendingInvite.set(null);

      if (result) {
        template.resendButtonText.set('invite resent');

      } else {
        CrossPlatform.alert({
          msg: e.message,
          title: 'Resend Invite'
        });
      }
    });
  },

  'click .up' (evt, template) {
    let txt = $('#limit').val();
    $('#limit').val(parseInt(txt) + 1);
  },

  'click .down' (evt, template) {
    let txt = $('#limit').val();
    if(txt <= 0) {
      return;
    }
    $('#limit').val(parseInt(txt) - 1);
  }
});
