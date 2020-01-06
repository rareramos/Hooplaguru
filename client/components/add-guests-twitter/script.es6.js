Template.AddGuestsTwitter.onCreated(function(){
  this.contacts = new ReactiveVar([]);

  this.formError                 = new ReactiveVar();
  this.contacts                  = new ReactiveVar([]);
  this.contactsWithoutLimitCount = new ReactiveVar(0);
  this.selectedContacts          = new ReactiveVar(new Set());
  this.allSelected               = new ReactiveVar();
  this.TwitterAccessToken        = new ReactiveVar();
  this.TwitterScreenName         = new ReactiveVar(); 

  //Meteor.subscribe('twitterdata', Meteor.userId());

});

Template.AddGuestsTwitter.onRendered(function(){
  var $this = this;
  this.autorun(() => {
    const slideIndex = Session.get('twitterRenderd');
    if(slideIndex)
    {
      Meteor.call('getTwitterAccessToken', Meteor.userId(), (e, result) => {
        $this.TwitterAccessToken.set(result);
      });
      Meteor.call('getTwitterScreenName', Meteor.userId(), (e, result) => {
        $this.TwitterScreenName.set(result);
        Meteor.call('getFriendlist', $this.TwitterScreenName.get(), (e, result) => {
          if(result) {
            $this.contacts.set(result.users);
          }
        });
      });
    }
  });
});

Template.AddGuestsTwitter.helpers({
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
  },
  
  loggedinTwitter() {
    return Template.instance().TwitterAccessToken.get();

    //return Template.instance().TwitterAccessToken.get();
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
  headerTitle(){
    return TAPi18n.__('guests.add_twitter');
  }
});

Template.AddGuestsTwitter.events({
   'click #login-twitter' (evt, template) {
    var template =  template;
    loadingtext($(event.target));
    Meteor.connectWithTwitter(null, function (err, data) {
        Meteor.call('getTwitterAccessToken', Meteor.userId(), (e, result) => {
          template.TwitterAccessToken.set(result);
        });
        Meteor.call('getTwitterScreenName', Meteor.userId(), (e, result) => {
          template.TwitterScreenName.set(result);
          
          Meteor.call('getFriendlist', template.TwitterScreenName.get(), (e, result) => {
            if(result) {
              template.contacts.set(result.users);
            }
          });

        });
      
    });
  },

  'click .close-add-guests-twitter' (evt, template){
    template.allSelected.set('');
    template.selectedContacts.set(new Set());
    PM.set('add-guests-twitter-modal', null);
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
      result = data[selectedContactId];

        let nameArr = result.name.split(' ');
      
        let guest = {lastName: nameArr.pop(), firstName: nameArr.join(' '),twitterId: result.id, inviteStatus: 'not invited', mailStatus: 'not sent'};
        
        guest.eventId = eventId;

        Meteor.call('Invites.insert', eventId, Invites.formatGuestInfo(guest));
    });
    
    template.allSelected.set('');
    template.selectedContacts.set(new Set());

    PM.set('add-guests-twitter-modal', null);
  },

  'click .select-all' (evt, template){
    let allSelected = Template.instance().allSelected.get();
    let allIds = $('ul.contacts-collection .personal-contact')
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