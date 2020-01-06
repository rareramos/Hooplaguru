Template.EditHost.helpers({
  currentEvent (){
    return Events.findOne(Session.get('eventFormId'));
  },

  currentHost (){
    return Invites.findOne(Session.get('hostInviteId'));
  },

  isSelf() {
    return Invites.findOne(Session.get('hostInviteId')).userId === Meteor.userId();
  }
});

Template.EditHost.events({
  'click #host-form-submit' (e){
    Utils.stopEvent(e);

    let formId = 'host-update-form';
    let hostInviteId = Session.get('hostInviteId');

    if (! AutoForm.validateForm(formId)) { return }

    let modifier = AutoForm.getFormValues(formId).updateDoc;

    Meteor.call('Invites.update', hostInviteId, modifier);
    PM.set('edit-host', null);
  },

  'click #delete-host-btn' (){
    let eventId = Session.get('eventFormId');
    let hostInviteId = Session.get('hostInviteId');

    Meteor.call('Invites.remove', hostInviteId, eventId);
    PM.set('edit-host', null);
  },
});
