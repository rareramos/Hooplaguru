Template.AddGuests.onCreated(function(){
  Session.set('eventHostNameInfo',false);
});

Template.EventBaseForm.events({
  'click .plus-one' (){
    var eventId = PM.get('event-form-id');
    var update = {$set: {}};

    if (this.currentEvent.isPlusOne) {
      update['$set'].isPlusOne = false;

    } else {
      update['$set'].isPlusOne = true;
    }

    Meteor.call('Events.update', eventId, update);
  },

  'click .hide-guest-list' (){
    var eventId = PM.get('event-form-id');
    var update = {$set: {}};

    if (this.currentEvent.hideGuestList) {
      update['$set'].hideGuestList = false;

    } else {
      update['$set'].hideGuestList = true;
    }

    Meteor.call('Events.update', eventId, update);
  },

  'keypress #hostName' (){
    Session.set('eventHostNameInfo',true);
  }
  
});

Template.EventBaseForm.helpers({
  eventTitle (){
    return TAPi18n.__("event_add.event_title");
  },

  eventDescription (){
    return TAPi18n.__("event_add.event_description");
  },

  eventTitleWarning (){
    
    return Session.get('eventTitleWarning');
  },
  eventHostName (){
    if(this.currentEvent) {
      return this.currentEvent.hostName();
    }
  },
  eventHostNameInfo() {
    return Session.get('eventHostNameInfo');
  },
  eventHostNameWarning (){
    
    return Session.get('eventHostNameWarning');
  },

});