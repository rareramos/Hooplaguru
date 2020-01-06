Template.AddGuestsOutlook.onCreated(function(){
  
  this.contacts = new ReactiveVar([]);

  this.formError                 = new ReactiveVar();
  this.contacts                  = new ReactiveVar([]);
  this.contactsWithoutLimitCount = new ReactiveVar(0);
  this.selectedContacts          = new ReactiveVar(new Set());
  this.allSelected               = new ReactiveVar();
  this.OutlookToken              = new ReactiveVar(false);

});

Template.AddGuestsOutlook.onRendered(function(){
  let self = this;
  this.autorun(() => {
    const slideIndex = Session.get('outlookRenderd');
    if(slideIndex)
    {
      Meteor.call('outlookuserlist', Meteor.userId(), (error, result) => {
        if(result)
        {
          self.OutlookToken.set(true);
          self.contacts.set(result.data.data);     
        }
      });
    }
  });
});

Template.AddGuestsOutlook.helpers({
  eventlist() {
    const eventIds = Invites.find({
      userId: Meteor.userId(),
      isHost: true,
      eventId: {$ne: Session.get('eventId')}
    }).map(invite => invite.eventId);

    const events = Events.find({
      _id: {$in: eventIds}, creating: false
    }).fetch();

    return events;
  },

  visibleContacts() {
    let data =  Template.instance().contacts.get();
    return _.map(data, function(value, key) {
    return {
      key: key,
      value: value
    };
  });
    //return data.data;
  },

  addContactsButtonText (){
    let count = Template.instance().selectedContacts.get().size;
    
    return TAPi18n.__('guests.add')+` ${count} ${count === 1 ?  TAPi18n.__('guests.guest') : TAPi18n.__('guests.guests')} `+TAPi18n.__('guests.to_list')
  },

  allSelected (){
    return Template.instance().allSelected.get();
  },

  selectAllText (){
    let allSelected = Template.instance().allSelected.get();
    return allSelected ?
      TAPi18n.__('guests.deselect_all') :
      TAPi18n.__('guests.select_all');
  },

  allSelectedIcon (){
    let allSelected = Template.instance().allSelected.get();
    return allSelected ?
      '/icons/form-checkbox-on@2x.png' :
      '/icons/form-checkbox-off@2x.png';
  },

  checkboxIcon (){
    let isSelected = Template.instance().selectedContacts.get().has(this.key);
    return isSelected ?
      '/icons/form-checkbox-on@2x.png' :
      '/icons/form-checkbox-off@2x.png';
  },
  loggedinOutlook() 
  {
     return Template.instance().OutlookToken.get();
  },
  headerTitle(){
    return TAPi18n.__('guests.add_guest');
  }
});

Template.AddGuestsOutlook.events({
  'click .close-add-guests-outlook' (evt, template){
    template.selectedContacts.set(new Set());
    template.allSelected.set(''); 
    PM.set('add-guests-outlook-modal', null);
  },

  'change .eventList' (evt, template){

    Meteor.subscribe('guest-list', evt.target.value);

    test = Invites.find({
            eventId: evt.target.value,
            inviteStatus: {$ne:'not invited'}
          },{sort: {firstName: 1}});

    template.contacts.set( test );
  },

  'click .personal-contact' (){
    let contactId = this.key;
    updateSelectedContacts(function (selectedContacts) {
      selectedContacts.has(contactId) ?
        selectedContacts.delete(contactId) :
        selectedContacts.add(contactId);

      return selectedContacts;
    })
  },

  'click #add-personal-contacts-btn' (evt, template){
    let data =  Template.instance().contacts.get();
    let selectedContactIds = Array.from(template.selectedContacts.get());
    //let contacts = PersonalContacts.findByIds(selectedContactIds);
    let eventId = Session.get('eventId');
    let invites = selectedContactIds.map(selectedContactId => {
      result = data.data[selectedContactId]; 
      contactInfo = result.emails.preferred;

      let guest = {firstName: result.first_name, lastName: result.last_name, emailOrPhone: contactInfo};
      guest.eventId = eventId;
      let test =  Invites.formatGuestInfo(guest);
      Meteor.call('Invites.insert', eventId, test);

      template.selectedContacts.set(new Set());
      template.allSelected.set(''); 
      PM.set('add-guests-outlook-modal', null);
    });

    //Meteor.call('Invites.insert', eventId, invites);
  },

  'click .select-all' (evt, template){
    let allSelected = Template.instance().allSelected.get();
    let allIds = $('ul.contacts-collection-outlook .personal-contact')
      .map(function() { return $(this).data('contact-id') })
      .toArray();

    updateSelectedContacts(function (selectedContacts) {
      allSelected ?
        allIds.forEach((id) => { selectedContacts.delete(id) }) :
        allIds.forEach((id) => { selectedContacts.add(id) }); 

      return selectedContacts;
    })

    Template.instance().allSelected.set(!allSelected);
  },

  'click #loginwithoutlook' (evt, template){
    loadingtext($(event.target));
    Meteor.connectWithMicrosoft({requestOfflineToken: true,
        requestPermissions: ['wl.basic', 'wl.emails', 'wl.signin', 'wl.offline_access']}, function (err,data) {
        if(!err) {
          Meteor.call('outlookuserlist', Meteor.userId(), (error, result) => {
            if(result) {
              template.OutlookToken.set(true);
              template.contacts.set(result.data.data); 
            }
          });
        } else {
          console.log(err);
          CrossPlatform.alert({msg: err[0].message})
        }
    });
  }
});

function updateSelectedContacts (callback) {
  let selectedContactsReactiveVar = Template.instance().selectedContacts;
  let previousContacts            = selectedContactsReactiveVar.get();
  let currentContacts             = callback(previousContacts);
  selectedContactsReactiveVar.set(currentContacts);
}