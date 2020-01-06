Template.EventsShowRsvp.onCreated(function(){
  this.eventGuest = new ReactiveVar();

  this.autorun(() => {
    const eventId = Session.get('eventId');
    const invite = Invites.findOne({
      userId: Meteor.userId(),
      eventId
    });

    this.eventGuest.set(invite);
  });
});

Template.EventsShowRsvp.onRendered(function () {
  rsvpYes()
});

Template.EventsShowRsvp.helpers({
  thisGuest (){
    return Template.instance().eventGuest.get();
  },

  thisEvent (){
    return Events.findOne(Session.get('eventId'));
  },

  toggleButtonText (){
    const {isHidden} = Template.instance().eventGuest.get() || {}

    if (isHidden) {
      return TAPi18n.__('guests.show_me_inlist');

    } else {
      return TAPi18n.__('guests.hide_me_inlist');
    }
  },

  isEnablePush (){
    let allSelected = Invites.findOne({eventId: Session.get('eventId'), userId: Meteor.userId()}).isEnablePush;
    return allSelected ?
      '/icons/form-checkbox-on@2x.png' :
      '/icons/form-checkbox-off@2x.png';
  },

  isSyncCalendar (){

    let allSelected = Invites.findOne({eventId: Session.get('eventId'), userId: Meteor.userId()}).isSyncCalendar;
    return allSelected ?
      '/icons/form-checkbox-on@2x.png' :
      '/icons/form-checkbox-off@2x.png';
  },
  isNotificationSMS (){
    let allSelected = Invites.findOne({eventId: Session.get('eventId'), userId: Meteor.userId()});
    return allSelected && allSelected.isSMSNotification ?
      '/icons/form-checkbox-on@2x.png' :
      '/icons/form-checkbox-off@2x.png';
  },

  isHideGuestList (){
    return !Events.findOne(Session.get('eventId')).hideGuestList
  },
  whosGoingTitle() {
    return TAPi18n.__('guests.whos_going');
  }
});

Template.EventsShowRsvp.events({
  'click #toggle-hide-guest' (evt, template){
    const invite = template.eventGuest.get();
    Invites.toggleHidden(invite);
  },
  'click #choose-rsvp-yes' (){
    changeInviteStatus('attending');
    rsvpYes();
    return false
  },
  'click #choose-rsvp-no' (){
    changeInviteStatus('not attending');
    rsvpYes();
    return false
  },
  'click .rsvp-checkboxes' (e){
    let eventId = Session.get('eventId');
    let guest = Invites.findOne({userId: Meteor.userId(), eventId});
    let update = {$set: {bringingPlusOne: !guest.bringingPlusOne}};

    Meteor.call('updateGuest', guest._id, update);
  },

  'click #delete-event-btn' (){
    let eventId = PM.get('event-id');
    let inviteId = Invites.findOne({
      userId: Meteor.userId(), eventId
    })._id;

    if (Meteor.isCordova && navigator.notification) {
      var buttonIndex = ''
      var onConfirm = function(buttonIndex) {
        if (buttonIndex === 2) {
          Meteor.call('Invites.remove', inviteId, eventId);

          Session.set('eventId', null);
          PM.set('event-id', null);
          PM.set('event-nav', 0);
        }
      }

      var deleteEventConfirm = function() {
        navigator.notification.confirm(
          TAPi18n.__('guests.remove_confirm'),
          onConfirm,
          'Delete Event',
          [TAPi18n.__('general.cancel'),TAPi18n.__('general.ok')]
        )
      }

      deleteEventConfirm();

    } else {
      if (window.confirm(TAPi18n.__('guests.delete_confirm'))) {
        Meteor.call('Invites.remove', inviteId, eventId);

        Session.set('eventId', null);
        PM.set('event-id', null);
        PM.set('event-nav', 0);
      }
    }
  },

  'click .push-enable-checkbox' (){
      let enablePush = Invites.findOne({eventId: Session.get('eventId'), userId: Meteor.userId()});
      let update = {$set: {}};
      if (enablePush.isEnablePush) {
        update['$set'].isEnablePush = false;

      } else {
        update['$set'].isEnablePush = true;
        //update['$set'].isSMSNotification = false;
      }

      Invites.update({_id: enablePush._id},update);
    },
    'click .sms-notification-checkbox' (){
      let smsPush = Invites.findOne({eventId: Session.get('eventId'), userId: Meteor.userId()});
      let update = {$set: {}};
      if (smsPush.isSMSNotification) {
        update['$set'].isSMSNotification = false;

      } else {
        update['$set'].isSMSNotification = true;
        //update['$set'].isEnablePush = false;
      }
  
      Invites.update({_id: smsPush._id},update);
    },
    'click .calendar-checkbox' (){
      let syncCalendar = Invites.findOne({eventId: Session.get('eventId'), userId: Meteor.userId()});

      if (syncCalendar.isSyncCalendar) 
      {
        isSyncCalendar = false;

      } else {
        isSyncCalendar = true;
      }

      Invites.update({_id: syncCalendar._id},{$set: {isSyncCalendar: isSyncCalendar}});

      calendarSyncEvent(isSyncCalendar,Session.get('eventId'));
 
    }

});

function changeInviteStatus(inviteStatus){
  let eventId = Session.get('eventId');
  let invite = Invites.findOne({userId: Meteor.userId(), eventId});
  Meteor.call(
    'Invites.update',
    invite._id,
    {
      $set: {
        inviteStatus
      }
    }
  );
}

function rsvpYes () {
  let eventId = Session.get('eventId');
  let guest = Invites.findOne({userId: Meteor.userId(), eventId: eventId});
  let rsvpYes = guest && guest.inviteStatus === 'attending';

  $('#choose-rsvp-yes input').prop('checked', rsvpYes);
  $('#choose-rsvp-no input').prop('checked', !rsvpYes);

  return rsvpYes;
}
