Template.EventForm.onRendered(() => {
  Hoopla.setHeight({
    container: $(window),
    target: $('.event-form-slide'),
    offsets: [$('.event-form-nav')],
    padding: 1
  });
});

Template.EventForm.helpers({
  firstSlide (){
    return Session.get('firstSlide');
  },

  secondSlide (){
    return Session.get('secondSlide');
  },

  thirdSlide (){
    return Session.get('thirdSlide');
  },

  categoryTitle (){
    var category = CoverPhotoCategories.findOne(Session.get('category-id'));

    return (category && category.name);
  },

  eventFormTitle (){
    if (Session.get('isEventEdit')) {
      return TAPi18n.__("event_add.edit");
    } else {
      return TAPi18n.__("event_add.created");
    }
  },

  coverPhotoTitle (){
    return TAPi18n.__("event_add.cover_photo");
  },

  currentEvent (){
    return Events.findOne(Session.get('eventFormId'));
  },
  addActivityTitle (){
    return TAPi18n.__("event_add.add_activity");
  },
  editActivityTitle (){
    return TAPi18n.__("activity_add.edit_activity");
  },
  locationTitle (){
    return TAPi18n.__("activity_add.location");
  },
});

Template.EventForm.events({
  'click .close-event-form' (){
    var event = Events.findOne(PM.get('event-form-id'));
    var msg = TAPi18n.__("events.event_exits");
    Session.set('eventHostNameInfo',false);
    if (event && event.creating && event.hasContent() && confirmExit(event, msg)) {
      Meteor.call('Events.remove', PM.get('event-form-id'));
      PM.set('event-form', null);

    } else if (event && event.creating && (! event.hasContent())) {
      PM.set('event-form', null);

    } else if (event && (! event.creating)) {
      PM.set('event-form', null);

    } else if (! event) {
      PM.set('event-form', null);
      PM.set('event-form-id', null, true);
    }
  },

  'click #select-cover-photo' (){
    PM.set('cover-photo', true);
  },

  'click .close-cover-photo' (){
    PM.set('cover-photo', null);
  },

  'click #add-host-btn' (){
    PM.set('add-host', true);
  },

  'click .close-add-host' (){
    PM.set('add-host', null);
  },

  'click .close-edit-host' (){
    PM.set('edit-host', null);
  },

  'click .close-add-activity' (){
    PM.set('add-activity', null);
  },

  'click .close-edit-activity' (){
    PM.set('edit-activity', null);
  },

  'click .category-preview' (){
    PM.set('cover-photo-category', true);
    PM.set('category-id', this.context._id, true);
  },

  'click .close-cover-photo-category' (){
    PM.set('cover-photo-category', null);
  },

  'click .close-location' (){
    PM.set('location', null);
  },

  'click .close-date-and-time' (){
    PM.set('datetime', null);
  },

  //'click .rightmost.edit' (){
    //Session.get('mediaEdit') ? Session.set('mediaEdit', null) : Session.set('mediaEdit', true);
  //},

  'click .close-media' (){
    PM.set('media', null);
  },

  'click #save-event-as-draft-btn' (evt){
    saveMyEvent(evt,'save-as-draft');
  },

  'click #save-event-guest-btn' (evt){
    saveMyEvent(evt,'save-my-event');
  },

  'click #save-event-btn' (evt){     

    resetWarnings();
    var event = Events.findOne(PM.get('event-form-id'));
    var update = AutoForm.getFormValues('event-base-form').updateDoc;

    var eventTitleValid = validateEventTitle();
    var eventHostName = validateEventHostName();

    let eventIsValid = eventTitleValid && eventHostName &&
      event.hasActivities() &&
      event.hasCoverPhoto()
    
    loadingtext($(evt.target));
    Session.set('overlayTemplate', 'Loading');
    if (eventIsValid) {
      update['$set'].creating = false;

      Meteor.call('Events.update', PM.get('event-form-id'), update, (err, result) => {
        if (err) {
          Session.set('overlayTemplate', null);
          CrossPlatform.alert({msg: err.message});
          return
        }
        Session.set('eventHostNameInfo',null);
        let isNew = !Session.get('isEventEdit');
        if (isNew) {
          //Meteor.call('welcomeWallPost', event._id);

          // NOTE: move to guest list after we go to event page
          PM.set('event-nav', null)

          Meteor.setTimeout(() => {
            PM.set('event-id', event._id);
          }, 100)

          Meteor.setTimeout(() => {
            PM.set('event-nav', 3, true);
            Session.set('overlayTemplate', null);
            PM.set('event-form', null);
          }, 2000)

        } else {
          Session.set('overlayTemplate', null);
          PM.set('event-form', null);
        }

        updateEventHostName(event._id,Meteor.userId(),update.$set.hostName);
        //Calendar event sync
        calendarSyncEventIntialTime();

      });
    } else {
      Session.set('overlayTemplate', null);
      Session.set('noCoverPhoto', !event.hasCoverPhoto());
    }
  },
});

var confirmExit = (event, msg) => {
  if (Meteor.isCordova && navigator.notification) {
    var buttonIndex = ''

    var onConfirm = function(buttonIndex) {
      if (event && event.creating && event.hasContent() && buttonIndex === 2) {
        Meteor.call('Events.remove', PM.get('event-form-id'));
        PM.set('event-form', null);
      }
      //} else if (event && event.creating && (! event.hasContent())) {
        //PM.set('event-form', null);

      //} else if (event && (! event.creating)) {
        //PM.set('event-form', null);

      //} else if (! event) {
        //PM.set('event-form', null);
        //PM.set('event-form-id', null, true);
      //}
    }

    navigator.notification.confirm(
      msg,
      onConfirm,
      'Create Event',
      ['Cancel','OK']
    )

  } else {
    return window.confirm(msg);
  }
}

var validateEventTitle = () => {
  var title = $('#eventTitle').val();

  if (title != '') {
    return true;

  } else {
    Session.set('eventTitleWarning', true);
    return false;
  }
};

var validateEventHostName = () => {
  var hostName = $('#hostName').val();

  if (hostName != '') {
    return true;

  } else {
    Session.set('eventHostNameWarning', true);
    return false;
  }
};

var resetWarnings = () => {
  Session.set('eventHostNameWarning', null);
  Session.set('eventTitleWarning', null);
};

var updateEventHostName = (eventId,userId,name) => {
   
   var fullname = name.split(' ');
   if(fullname.length > 1)
   {
      var lastName = fullname.pop();
      var firstName = fullname.join(' '); 
   }
   else
   {
     var lastName = '';
     var firstName = fullname[0];
   }
   
   var inviteData = Invites.findOne({eventId:eventId, userId:userId, isHost: true});
   Meteor.call('Invites.update', inviteData._id, {$set: {
      firstName: firstName, lastName: lastName
    }});
};

var saveMyEvent = (evt,option) => {
    resetWarnings();
    var event = Events.findOne(PM.get('event-form-id'));
    var update = AutoForm.getFormValues('event-base-form').updateDoc;

    var eventTitleValid = validateEventTitle();
    var eventHostName = validateEventHostName();

    let eventIsValid;
    if(option == 'save-as-draft'){
         eventIsValid = eventTitleValid && eventHostName &&
      event.hasCoverPhoto();
    } else {
       eventIsValid = eventTitleValid && eventHostName &&
      event.hasActivities() &&
      event.hasCoverPhoto()
    }
    
    loadingtext($(evt.target));
    Session.set('overlayTemplate', 'Loading');
    if (eventIsValid) {
      update['$set'].creating = false;

      if(option == 'save-as-draft'){
        update['$set'].saveAsDraft = true;
      } 

      Meteor.call('Events.update', PM.get('event-form-id'), update, (err, result) => {
        if (err) {
          Session.set('overlayTemplate', null);
          CrossPlatform.alert({msg: err.message});
          return
        }

        Session.set('eventHostNameInfo',null);
        let isNew = !Session.get('isEventEdit');
        if (isNew) {
          //Meteor.call('welcomeWallPost', event._id);

          // NOTE: move to guest list after we go to event page
          PM.set('event-nav', null)

          Meteor.setTimeout(() => {
            PM.set('event-id', event._id);
          }, 100)

          Meteor.setTimeout(() => {
            if(option == 'save-my-event'){
              PM.set('event-nav', 3, true);
            }
            Session.set('overlayTemplate', null);
            PM.set('event-form', null);
            if(option == 'save-as-draft'){
              PM.set('event-id', null);
            }
          }, 2000)

        } else {
          Session.set('overlayTemplate', null);
          PM.set('event-form', null);
        }

        updateEventHostName(event._id,Meteor.userId(),update.$set.hostName);
        
        if(option == 'save-my-event'){
          //Calendar event sync
          calendarSyncEventIntialTime();
        }

      });
    } else {
      Session.set('overlayTemplate', null);
      Session.set('noCoverPhoto', !event.hasCoverPhoto());
    }
}
