const DEFAULT_CONTACTS_LIMIT = 50;
const CONTACTS_LIMIT_STEP    = 50;

Template.AddGuests.onCreated(function(){
  this.formError                 = new ReactiveVar();
  this.guestAddedSucc            = new ReactiveVar();
  this.guestBtnText              = new ReactiveVar();
  this.contactSearchKeyword      = new ReactiveVar('');
  this.contactsLimit             = new ReactiveVar(DEFAULT_CONTACTS_LIMIT);
  this.contacts                  = new ReactiveVar([]);
  this.contactsWithoutLimitCount = new ReactiveVar(0);
  this.selectedContacts          = new ReactiveVar(new Set());
  this.allSelected               = new ReactiveVar();

  PM.register('add-guests-modal', (val, state, done) => {
    if (state.removed) {
      setTimeout(() => {
        $('#search-contacts').val('');
        this.contactSearchKeyword.set('');
        this.selectedContacts.set(new Set())
        this.allSelected.set(false)
      }, 300);
    }
  });

  this.autorun(() => {
    
    this.guestBtnText.set(TAPi18n.__('guests.guest_add'));
    let text = this.guestBtnText.get();

    if (text === 'guest added') {
      $('#add-guest-btn').attr('disabled', true);
    } else {
      $('#add-guest-btn').attr('disabled', null);
    };
  });

  let template = this;
  let refreshContacts = lodash.debounce(function (nameKeyword, limit) {
    template.contacts.set(
      PersonalContacts.findByKeyword(nameKeyword, limit)
    );
    template.contactsWithoutLimitCount.set(
      PersonalContacts.findByKeyword(nameKeyword).length
    );
  }, Hoopla.keyupDebounce);

  this.autorun(function () {
    // update when we the contacts change
    PersonalContacts._updatedAt.get();
    let nameKeyword = template.contactSearchKeyword.get();
    let limit       = template.contactsLimit.get();
    refreshContacts(nameKeyword, limit)
  });
});

Template.AddGuests.helpers({
  visibleContacts() {
    return Template.instance().contacts.get();
  },

  moreToCome() {
    let limit = Template.instance().contactsLimit.get();
    let total = Template.instance().contactsWithoutLimitCount.get();
    return limit < total;
  },

  guestBtnText (){
    let instance = Template.instance();
    let text = instance.guestBtnText.get();
  
    if (text === 'guest added') {
        instance.guestBtnText.set(TAPi18n.__('guests.guest_add'))
    }

    return text;
  },

  formError (){
    return Template.instance().formError.get();
  },

  guestAddedSucc (){
    return Template.instance().guestAddedSucc.get();
  },

  guestFormTitle (){
    if (Session.get('addGuestsTab') === 'from-contacts') {
      return TAPi18n.__('guests.add_contact');
    } else {
      return TAPi18n.__('guests.add_manually');
    }
  },

  guestSwiperOptions (){
    return {
      speed: 0,
      touchRatio: 0,
    };
  },

  contactsActiveClass (){
    if (Session.get('addGuestsTab') === 'from-contacts') {
      return 'contacts-active';
    } else {
      return '';
    }
  },

  addManuallyActiveClass (){
    if (Session.get('addGuestsTab') === 'add-manually') {
      return 'add-manually-active';
    } else {
      return '';
    }
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
  firstnameTitle(){
    return TAPi18n.__('guests.firstname');
  },
  lastnameTitle(){
    return TAPi18n.__('guests.lastname');
  },
  getCountryCode() {
    
    $.get("https://ipinfo.io", function(response) {
      let result = Countries.findOne({cn_iso_2:response.country});
      Session.set('currentCountryCode', result.uid);
      $('#countryCode').val('+'+result.cn_phone);   
      
    }, "jsonp");
  }
});

Template.AddGuests.events({
  'keyup #search-contacts': _.debounce((evt, template) => {
    let keyword = evt.target.value;

    if (keyword !== template.contactSearchKeyword.get()) {
      template.contactSearchKeyword.set(keyword);
      template.contactsLimit.set(DEFAULT_CONTACTS_LIMIT);
    }
  }, Hoopla.keyupDebounce),

  'click .load-more': function (event, template) {
    let increasedLimit = template.contactsLimit.get() + CONTACTS_LIMIT_STEP;
    template.contactsLimit.set(increasedLimit);
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

  'click #from-contacts' (){
    if (PM.get('add-guests-tab') !== 'from-contacts') {
      PM.set('add-guests-tab', 'from-contacts');
    }
  },

  'click #add-manually' (){
    if (PM.get('add-guests-tab') !== 'add-manually') {
      PM.set('add-guests-tab', 'add-manually');
    }
  },

  'click .close-add-guests' (evt, template){
    template.formError.set(null);
    template.guestAddedSucc.set(null);
    var codeVar = $('#countryCode').val(); 
    AutoForm.resetForm('add-guest-form');
    $('.email-phone').removeClass('s12')
    $('.email-phone').addClass('s10');
    $('#choose-email input').prop('checked', false);
    $('#choose-phone input').prop('checked', true);
    $('.countryCodeInput').show();
    $('#countryCode').val(codeVar);
    PM.set('add-guests-modal', null);
  },

  'click .done-adding-btn' (evt, template){
    template.formError.set(null);
    template.guestAddedSucc.set(null);
    var codeVar = $('#countryCode').val(); 
    AutoForm.resetForm('add-guest-form');
    
    $('.email-phone').removeClass('s12')
    $('.email-phone').addClass('s10');
    $('#choose-email input').prop('checked', false);
    $('#choose-phone input').prop('checked', true);
    $('.countryCodeInput').show();
    $('#countryCode').val(codeVar);
    $("#firstName").blur();
    PM.set('add-guests-main-modal', null);
    PM.set('add-guests-modal', null);
  },

  'click #add-guest-btn' (e, template){
    template.formError.set(null);

    if (! AutoForm.validateForm('add-guest-form')) { return }

    let eventId = PM.get('event-id');
    let type = $('input[name="inviteType"]:checked').val();
    let countryCode = $('#countryCode').val();



    let guest = AutoForm.getFormValues('add-guest-form').insertDoc;

    guest.eventId = eventId;
    guest.type = type;

    if(guest.type == 'phone') {
      guest.countryCode = countryCode;
    }

    let guestInvite = Invites.formatGuestInfo(guest);

    if (!guestInvite.phone && guestInvite.type == 'phone') {
      return template.formError.set(
        TAPi18n.__('guests.valid_phone')
      );
    }

    if (!guestInvite.email && guestInvite.type == 'email') {
      return template.formError.set(
        TAPi18n.__('guests.valid_email')
      );
    }

    if (! Invites.verifyUniqueInvite(guestInvite)) {
      return template.formError.set(
        TAPi18n.__('guests.guest_already')
      );
    }

    Meteor.call('Invites.insert', eventId, guestInvite);
    var codeVar = $('#countryCode').val();
    AutoForm.resetForm('add-guest-form');
    template.guestBtnText.set(TAPi18n.__('guests.guest_added'));
    $('.email-phone').removeClass('s12')
    $('.email-phone').addClass('s10');
    $('#choose-email input').prop('checked', false);
    $('#choose-phone input').prop('checked', true);
    $('.countryCodeInput').show();
    $('#countryCode').val(codeVar);
    template.guestAddedSucc.set(TAPi18n.__('guests.guest_added_succ'));
    setTimeout(() => {
      template.guestAddedSucc.set(null);
    }, 5000);
  },

  'click .personal-contact' (){
    let contactId = this._id;

    updateSelectedContacts(function (selectedContacts) {
      selectedContacts.has(contactId) ?
        selectedContacts.delete(contactId) :
        selectedContacts.add(contactId);

      return selectedContacts;
    })
  },

  'click #add-personal-contacts-btn' (evt, template){
    let selectedContactIds = Array.from(template.selectedContacts.get());
    let contacts = PersonalContacts.findByIds(selectedContactIds);
    let eventId = Session.get('eventId');
    let invites = contacts.map(contact => {
      if(!contact.name.givenName || contact.name.givenName == "") {
        if(contact.name.familyName && contact.name.familyName != "") {
          contact.name.givenName = contact.name.familyName;
          contact.name.familyName = "";       
        } else {
          contact.name.givenName = 'no name';
        }
      }
      return Invites.formatContactInfo({...contact, eventId});
    });

    Meteor.call('Invites.insert', eventId, invites);

    PM.set('add-guests-modal', null);
    template.contactSearchKeyword.set('');
    $('#search-contacts').val('');
  },

  'click #choose-email' (){
    
    $('.email-phone').removeClass('s10')
    $('.email-phone').addClass('s12');
    $('#choose-email input').prop('checked', true);
    $('#choose-phone input').prop('checked', false);
    $('.countryCodeInput').hide();
    
  },

  'click #choose-phone' (){

    $.get("https://ipinfo.io", function(response) {
     
      let result = Countries.findOne({cn_iso_2:response.country});

      $('.email-phone').removeClass('s12')
      $('.email-phone').addClass('s10');
      
      $('#choose-phone input').prop('checked', true);
      $('#choose-email input').prop('checked', false);
      $('.countryCodeInput').show();
      var codeSession = Session.get('currentCountryCode'); 

      if(codeSession) {
        Session.set('currentCountryCode', codeSession); 
      } else {
        Session.set('currentCountryCode', result.uid);
        $('#countryCode').val('+'+result.cn_phone);   
      }
      
    }, "jsonp");
  },

  'click .countryCodeInput' () {
    new Confirmation({
      message: $("#my-popup-box").html(),
      title: TAPi18n.__('login.select_country'),
      cancelText: TAPi18n.__('general.cancel'),
      okText: TAPi18n.__('general.ok'),
      success: true, // whether the button should be green or red
      focus: "cancel" // which button to autofocus, "cancel" (default) or "ok", or "none"
    }, function (ok) {
        if(ok) {
          $("#countryCode").val($(".selected-coutry-code").val());
          $(".coutrycodelist").children("li").stop().show();
        } else{
          $(".coutrycodelist").children("li").stop().show();
        }
    });
  },


});

// when using android, the "From Contacts" and "Add Manually" may miss clicks
let fixAndroidTouchingAreaBug = _.once(function() {
  if (window.device && window.device.platform === 'Android') {
    $('div').click(function(){})
  }
})

Template.AddGuests.onRendered(function () {
  if (Meteor.isCordova) {
    fixAndroidTouchingAreaBug()
  }
})

function updateSelectedContacts (callback) {
  let selectedContactsReactiveVar = Template.instance().selectedContacts;
  let previousContacts            = selectedContactsReactiveVar.get();
  let currentContacts             = callback(previousContacts);
  selectedContactsReactiveVar.set(currentContacts);
}
