Template.AddHost.helpers({
  currentEvent (){
    return Events.findOne(Session.get('eventFormId'));
  },
});

Template.AddHost.events({
  'click .host-form-submit-btn' (e){
    Utils.stopEvent(e);

    if (! AutoForm.validateForm('add-host-form')) { return }

    let form = AutoForm.getFormValues('add-host-form').insertDoc;
    let hostInvite = Invites.formatHostInfo({
      hostRole: 'Host',
      ...form,
      isHost: true,
      eventId: Session.get('eventFormId')
    });

    if (! hostInvite.phone && ! hostInvite.email) {
      return CrossPlatform.alert({
        msg: 'Host needs an email or a mobile number.',
        title: 'Add Host',
      })
    }

    let existingInvite = Invites.findExistingInvite(hostInvite);

    if (existingInvite) {
      return Meteor.call('Invites.update', existingInvite._id, {$set: {
        ...existingInvite,
        isHost: hostInvite.isHost,
        hostRole: hostInvite.hostRole,
        inviteStatus: 'not invited',
      }}, (e, result) => {
        if (! e) { return PM.set('add-host', null) }
        alertError();
      });

    } else {
      Meteor.call('Invites.insertHost', {...hostInvite}, (e, result) => {
        if (! e) { return PM.set('add-host', null) }
        alertError();
      });
    }
  },
});

let alertError = () => {
  CrossPlatform.alert({
    msg: 'Something went wrong. Please try again.',
    title: 'Add Host',
  });
};
