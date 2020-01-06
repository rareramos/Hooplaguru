Template.addCoHost.onCreated(function(){
	
});

Template.addCoHost.helpers({

  getYesGuest (){
    if(Session.get('eventId') != undefined) {
      let event = Events.findOne(Session.get('eventId'));
      let guestData = event.yesGuests().fetch();
      return guestData;
    } else {
      return;
    }
    
  }, 

  getSrc (){
    let isSelected = this.isHost;
    return isSelected ?
      '/icons/form-checkbox-on@2x.png' :
      '/icons/form-checkbox-off@2x.png';
  },

  checkHost() {
    return this.userId !== Meteor.userId();
  },

  cheGuestLength(){
    if(Session.get('eventId') != undefined) {
      let event = Events.findOne(Session.get('eventId'));
      let guestData = event.yesGuests().fetch();
      return guestData.length === 1;
    }
  },
  headerTitle() {
    return TAPi18n.__("add_cohost.header");
  },
});

Template.addCoHost.events({
  'click .guest-checkbox' (evt, template){

    let contactId = this.userId;
    const modifier = {$set: {
      isHost: !this.isHost, 
      hostRole: this.isHost ? '' : 'Co-Host'
    }};

    if (modifier.$set.isHost) {
      modifier.$set.isHidden = false;
    }

    Meteor.call('Invites.update', this._id, modifier);
  },

  'click .left-header-close' (evt, template){
	  PM.set('add-co-host', null);
  },

  'click #add-media-btn' (evt, template){
    PM.set('add-co-host', null);
  },

  
});

