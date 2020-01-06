Template.EventFormMain.helpers({
  coverPhotoLabel (){
    
    if (this.currentEvent && (this.currentEvent.coverPhotoId || this.currentEvent.blobCover)) {
      return TAPi18n.__("event_add.change_cover");
    } else {
      return TAPi18n.__("event_add.cover_photo");
    }
  },

  eventButtonText (){
    if (Session.get('isEventEdit')) {
      return TAPi18n.__("event_add.save_changes");

    } else {
      return TAPi18n.__("event_add.create_event");
    }
  },

  identifier (){
    return this.name || this.email;
  },

  noCoverPhoto (){
    return Session.get('noCoverPhoto');
  },

  editMode (){
    return Session.get('isEventEdit');
  },
  scheduleTitle (){
    return TAPi18n.__("events.schedule");
  },

  isActivityEnable() {

    if(PM.get('event-form-id')) {
      return true;
    } else {
      return false;
    }
  },

  inviteMoreGuestTitle (){
    
    if(this.currentEvent) {
      let guestCount = this.currentEvent.guestCount();
       
      if(guestCount > 1) {
        return TAPi18n.__("event_add.invite_more_guests");
      } else {
        return TAPi18n.__("event_add.add_guests_my_event");
      }
    } 
  },
  
});

Template.EventFormMain.events({
  'click #add-activity-btn' (){
    loadingtext($("event.target"));
    PM.set('add-activity', true);
  },

  'click #add-cohost-btn' (){
    PM.set('add-co-host', true);
  },

  'click #invite-more-event-btn' (){
    PM.set('event-form', null);
    PM.set('event-nav', null);
    PM.set('event-nav', 3, true);
  },

  'click #delete-event-btn' (){
    if (Meteor.isCordova && navigator.notification) {

      var buttonIndex = ''
      var onConfirm = function(buttonIndex) {
        if (buttonIndex === 2) {

          let eventImage = EventImages.find({eventId: PM.get('event-form-id')}).fetch();
          eventImage.forEach(function (data) {
            EventImages.deletePhotos (data);
          });

          deleteCalendarEvent(PM.get('event-form-id'));

          Meteor.call('Events.remove', PM.get('event-form-id'));

          Session.set('eventId', null);
          PM.set('event-form', null);
          PM.set('event-id', null);
        }
      }

      var deleteEventConfirm = function() {
        navigator.notification.confirm(
          TAPi18n.__('events.delete_confirm'),
          onConfirm,
          TAPi18n.__('events.delete'),
          ['Cancel','OK']
        )
      }

      deleteEventConfirm();

    } else {
      if (window.confirm(TAPi18n.__('events.delete_event'))) {   

        let eventImage = EventImages.find({eventId: PM.get('event-form-id')}).fetch();
        eventImage.forEach(function (data) {
          EventImages.deletePhotos (data);
        });
        
        Meteor.call('Events.remove', PM.get('event-form-id'));

        Session.set('eventId', null);
        PM.set('event-form', null);
        PM.set('event-id', null);   
      }
    }
  },

  'click #duplicate-event-btn' (){
    if (Meteor.isCordova && navigator.notification) {

      var buttonIndex = ''
      var onConfirm = function(buttonIndex) {
        if (buttonIndex === 2) {
          navigator.notification.prompt(
                  TAPi18n.__('events.valid_eventname'),  // message
                  function(results) {
                    eventName = results.input1;
                    if (eventName != null && results.buttonIndex == 2) {
                      Session.set('overlayTemplate', 'Loading');
                      Meteor.call('duplicateEvent', Session.get('eventId'), eventName,  (e, result) => {
                       if (result) {
                          Session.set('eventId', null);
                          PM.set('event-form', null);
                          PM.set('event-id', null);
                          Session.set('overlayTemplate', null);
                       } else {
                         CrossPlatform.alert({
                           msg: e.message,
                           title: 'Resend Invite'
                         });
                       }
                      })
                    }
                  },                  // callback to invoke
                  TAPi18n.__('events.duplicate'),            // title
                  ['Cancel','OK']              // buttonLabels
              );
        }
      }

      var duplicateEventConfirm = function() {
        navigator.notification.confirm(
          TAPi18n.__('events.duplicate_confirm'),
          onConfirm,
          TAPi18n.__('events.duplicate'),
          ['Cancel','OK']
        )
      }

      duplicateEventConfirm();

    } else {
      if (window.confirm(TAPi18n.__('events.duplicate_confirm'))) {   
        var eventName = prompt(TAPi18n.__('events.valid_eventname'), "");

        if (eventName != null) {
          Session.set('overlayTemplate', 'Loading');
          Meteor.call('duplicateEvent', Session.get('eventId'), eventName, (e, result) => {
           if (result) {
            Session.set('eventId', null);
            PM.set('event-form', null);
            PM.set('event-id', null);
            Session.set('overlayTemplate', null);

           } else {
             CrossPlatform.alert({
               msg: e.message,
               title: 'Resend Invite'
             });
           }
          }) 
        }
        
      }
    }
  },
  
});
