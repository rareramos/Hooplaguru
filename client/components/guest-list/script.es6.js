Template.GuestList.onCreated(function () {
  this.isSending = new ReactiveVar(false);
  this.isSendingNoReply = new ReactiveVar(false);

});

Template.GuestList.events({
  'click .add-guests-btn' (){
    let event = Events.findOne(Session.get('eventId'));
    if(event.hasActivities() == 0) {
      CrossPlatform.alert({msg: "Please Add At Least One Activity To Invite Guests."});
      return false;
    }
    loadingtext($(event.target));
    PM.set('add-guests-main-modal', true);
  },

  'click #open-preview-invite' (){
    PM.set('invite-preview', true);
  },

  'click .person-list-item' (){
    if (this.group) {
      PM.set('group-id', this.context._id);
    } else {
      PM.set('group-id', this.context.groupId);
    }

    PM.set('group-modal', true, true);
  },

  'click .send-outstanding-invites' (jsEvent, template){
    let event = Events.findOne(Session.get('eventId'));

    template.isSending.set(true);         
    Meteor.call(
      'Server.Invites.sendMultiple',
      event.uninvitedGuestIds(), (e, result) => {
        template.isSending.set(false);
        e && CrossPlatform.alert({msg: e.message})
      }
    );
  },

  'click .resend-noreply' (jsEvent, template){
    let event = Events.findOne(Session.get('eventId'));
    template.isSendingNoReply.set(true);
    Meteor.call(
      'Server.Invites.sendMultiple',
      event.noReplyGuestIds(), (e, result) => {
        template.isSendingNoReply.set(false);
        e && CrossPlatform.alert({msg: e.message})
      }
    );
  },

  'click .push-enable-checkbox' (){
    let enablePush = Invites.findOne({eventId: Session.get('eventId'), userId: Meteor.userId()});

    if (enablePush.isEnablePush) {
      isEnablePush = false;

    } else {
      isEnablePush = true;
    }

    Invites.update({_id: enablePush._id},{$set: {isEnablePush: isEnablePush}});
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
  },

  'click .public-checkbox' (){
    if (this.currentEvent && this.currentEvent.publicEvent) {
      isEnablePush = false;

    } else {
      isEnablePush = true;
    }

    Events.update({_id: this.currentEvent._id},{$set: {publicEvent: isEnablePush}});
  },

  'click .guestlist-checkbox' (jsEvent, template){
     let pushStatus = Invites.findOne({eventId: Session.get('eventId'),userId:Meteor.userId()});
     let update = {$set: {}};
     if (pushStatus.isEnablePush) {
       update['$set'].isEnablePush = false;
 
     } else {
       update['$set'].isEnablePush = true;
       //update['$set'].isSMSNotification = false;
     }
     Invites.update({_id: pushStatus._id},update);
   },

   'click .sms-checkbox' (jsEvent, template){
     let smsStatus = Invites.findOne({eventId: Session.get('eventId'),userId:Meteor.userId()});
     let update = {$set: {}};
     if (smsStatus.isSMSNotification) {
       update['$set'].isSMSNotification = false;
 
     } else {
       update['$set'].isSMSNotification = true;
       //update['$set'].isEnablePush = false;
     }
 
     Invites.update({_id: smsStatus._id},update);
   }

});

Template.GuestList.helpers({
  isSending: function () {
    return Template.instance().isSending.get();
  },
  isSendingNoReply: function () {
    return Template.instance().isSendingNoReply.get();
  },
  isEnablePush (){
    let allSelected = Invites.findOne({eventId: Session.get('eventId'), userId: Meteor.userId()});
    return allSelected && allSelected.isEnablePush ?
      '/icons/form-checkbox-on@2x.png' :
      '/icons/form-checkbox-off@2x.png';
  },
  
  isSyncCalendar (){

    let allSelected = Invites.findOne({eventId: Session.get('eventId'), userId: Meteor.userId()});
    return allSelected && allSelected.isSyncCalendar ?
      '/icons/form-checkbox-on@2x.png' :
      '/icons/form-checkbox-off@2x.png';
  },

  isPublicEvent (){
    return this.currentEvent && this.currentEvent.publicEvent ?
      '/icons/form-checkbox-on@2x.png' :
      '/icons/form-checkbox-off@2x.png';
  },

  publicEvent (){
    return this.currentEvent && this.currentEvent.publicEvent;
  },

  publicText (){
    return this.currentEvent && this.currentEvent.publicEvent ?
      TAPi18n.__('guests.event_made_public') :
      TAPi18n.__('guests.make_event_public');
  },

  isPushEnabled : function () {
     let invite = Invites.findOne({eventId: Session.get('eventId'),userId:Meteor.userId()});
     if(invite) {
      return invite.isEnablePush;
     }
   },
   isSMSNotification : function () {
     let invite = Invites.findOne({eventId: Session.get('eventId'),userId:Meteor.userId()});
     if(invite) {
      return invite.isSMSNotification;
     }
   },
   groupHeader (){
      return TAPi18n.__('guests.group.groups');
   },
   notInviteHeader (){
      return TAPi18n.__('guests.not_invited');
   },

   yesHeader (){
      return TAPi18n.__('guests.yes');
   },
   noHeader (){
      return TAPi18n.__('guests.no');
   },
   noreplyHeader (){
      return TAPi18n.__('guests.no_reply');
   },

   checkEventIsDraft (){
    
    let invite = Invites.find({eventId: Session.get('eventId'),isHost:false}).fetch();
    let eventsData = Events.findOne({_id: Session.get('eventId'), saveAsDraft:true});

    if(invite.length > 0 && eventsData) {
      Meteor.call('updateEventAsDraft', Session.get('eventId'), (e, result) => {
      });
    }
   },

   checkGuestMoreOne() {

    if(this.currentEvent.uninvitedCount() > 1) {
      return TAPi18n.__('guests.guests');
    } else {
      return TAPi18n.__('guests.guest');
    }
   }

});



