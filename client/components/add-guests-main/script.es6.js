Template.AddGuestsMain.events({
  'click .close-add-guests-main' (evt, template){
    PM.set('add-guests-main-modal', null);
  },
  'click #add-guest-contact-btn' (evt, template){
  	Session.set('addGuestsTab','from-contacts');
    loadingtext($(event.target));
   	PM.set('add-guests-modal',true);
  },
  'click #add-guest-manually-btn' (evt, template){
  	Session.set('addGuestsTab','add-manually');
    loadingtext($(event.target));
  	PM.set('add-guests-modal',true);
  },
  'click #add-guest-events-btn' (evt, template){
    PM.set('add-guests-events-modal',true);
    loadingtext($(event.target));
  },
  'click #add-guest-outlook-btn' (evt, template){
    PM.set('add-guests-outlook-modal',true);
    loadingtext($(event.target));
  },
  'click #add-guest-twitter-btn' (evt, template){
    PM.set('add-guests-twitter-modal',true);
    loadingtext($(event.target));
  },
  'click #guest-main-btn' (evt, template){
    PM.set('add-guests-main-modal',null);
  },
  'click #add-guest-file-btn' (evt, template){
    PM.set('add-guests-file-modal',true);
  },
});

Template.AddGuestsMain.helpers({

  headerTitle(){
    return TAPi18n.__('guests.add_guest');
  }
});