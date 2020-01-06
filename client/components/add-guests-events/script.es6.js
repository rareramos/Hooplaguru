Template.AddGuestsEvents.onCreated(function(){
  this.contacts = new ReactiveVar([]);

  this.formError                 = new ReactiveVar();
  this.contacts                  = new ReactiveVar([]);
  this.contactsWithoutLimitCount = new ReactiveVar(0);
  this.selectedContacts          = new ReactiveVar(new Set());
  this.allSelected               = new ReactiveVar();

});

Template.AddGuestsEvents.helpers({
  eventlist() {
    const eventIds = Invites.find({
      userId: Meteor.userId(),
      isHost: true,
      eventId: {$ne: Session.get('eventId')}
    }).map(invite => invite.eventId);

    const events = Events.find({
      _id: {$in: eventIds}, creating: false
    },{ sort: { eventStartTime: 1 }}).fetch();
    
    events.reverse();
    return events;
  },

  visibleContacts() {
    return Template.instance().contacts.get();
  },

  visibleContactsCount() {
    return Template.instance().contacts.get().length > 0;
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
    let isSelected = Template.instance().selectedContacts.get().has(this._id);
    return isSelected ?
      '/icons/form-checkbox-on@2x.png' :
      '/icons/form-checkbox-off@2x.png';
  },
  headerTitle(){
    return TAPi18n.__('guests.add_pastevent');
  }
});

Template.AddGuestsEvents.events({
  'click .close-add-guests-events' (evt, template){
    clearPastEventForm(evt, template);
    PM.set('add-guests-events-modal', null);
  },

  'change .eventList' (evt, template){

    test = Invites.find({
            eventId: evt.target.value,
            inviteStatus: {$ne:'not invited'},
            isHost: false,
            $or: [{phone: {$exists: true}},{email: {$exists: true}}]
          },{sort: {firstName: 1}});

    template.contacts.set( test.fetch() );
  },

  'click .personal-contact' (evt, template){
    let contactId = this._id;
    test = Invites.find({
            eventId: $(".eventList").val(),
            inviteStatus: {$ne:'not invited'},
            isHost: false,
          },{sort: {firstName: 1}});

    updateSelectedContacts(function (selectedContacts) {
      selectedContacts.has(contactId) ?
        selectedContacts.delete(contactId) :
        selectedContacts.add(contactId);
        if(test.fetch().length == selectedContacts.size)
        {
            Template.instance().allSelected.set(true);
        }
        else
        {
            Template.instance().allSelected.set(false);
        }
        
      return selectedContacts; 
    })
  },

  'click #add-personal-contacts-btn' (evt, template){
    let selectedContactIds = Array.from(template.selectedContacts.get());
    //let contacts = PersonalContacts.findByIds(selectedContactIds);
    let eventId = Session.get('eventId');
    let invites = selectedContactIds.map(selectedContactId => {
      contact = Invites.findOne({
                  _id: selectedContactId
                });

      let contactInfo = "";
      if(contact.phone)
      {
        contactInfo = contact.phone;
      }
      else
      {
        contactInfo = contact.email;
      }

      let guest = {firstName: contact.firstName, lastName: contact.lastName, emailOrPhone: contactInfo};
      guest.eventId = eventId;
      return Invites.formatGuestInfo(guest);
    });
    
    Meteor.call('Invites.insert', eventId, invites);
    clearPastEventForm(evt, template);
    PM.set('add-guests-events-modal', null);
  },

  'click .select-all-event' (evt, template){
    let allSelected = template.allSelected.get();
    let allIds = $('ul.contacts-collection-events .personal-contact')
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
});

function updateSelectedContacts (callback) {
  let selectedContactsReactiveVar = Template.instance().selectedContacts;
  let previousContacts            = selectedContactsReactiveVar.get();
  let currentContacts             = callback(previousContacts);
  selectedContactsReactiveVar.set(currentContacts);
}

function clearPastEventForm(evt, template)
{
  template.selectedContacts.set(new Set());
  template.allSelected.set(false);
  $(".eventList").val('');
  template.contacts.set('');
}

