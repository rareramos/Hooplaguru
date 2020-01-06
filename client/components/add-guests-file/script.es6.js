const XLSX = require('xlsx');

Template.AddGuestsFile.onCreated(function(){
  
  this.contacts = new ReactiveVar([]);

  this.formError                 = new ReactiveVar();
  this.contacts                  = new ReactiveVar([]);
  this.contactsWithoutLimitCount = new ReactiveVar(0);
  this.selectedContacts          = new ReactiveVar(new Set());
  this.allSelected               = new ReactiveVar();

});

Template.AddGuestsFile.helpers({

  visibleContacts() {
    return  Template.instance().contacts.get();
  },

  visibleContactsCount() {
    return Template.instance().contacts.get().length > 0;
  },

  addContactsButtonText (){
    let count = Template.instance().selectedContacts.get().size;
    return TAPi18n.__('guests.add')+` ${count} ${count === 1 ?  TAPi18n.__('guests.guest') : TAPi18n.__('guests.guests')} `+TAPi18n.__('guests.to_list');
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
    return TAPi18n.__('guests.add_files');
  }
});

Template.AddGuestsFile.events({
  'click .close-add-guests-file' (evt, template){
    clearPastEventForm(evt, template);
    PM.set('add-guests-file-modal', null);
  },

  'change #upload-contact-file' (evt, template){

    const file = evt.currentTarget.files[0];
    
    if(file.name.split('.').pop() == 'csv' || file.name.split('.').pop() == 'xls' || file.name.split('.').pop() == 'xlsx'){
      const reader = new FileReader();
      reader.onload = function(e) {
        const data = e.target.result;
        const name = file.name;
        
        Meteor.call('Server.Invites.uploadFile', data, name, function(err, wb) {
          if(err) {
            CrossPlatform.alert({
                msg: err,
            });
            return false;
          } else {
            var results = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], {header:1});
            var index = 0;
            var contactArr = new Array();
            
            results.forEach((row) => {
               if(index != 0) {
                if(!row[3] && !row[4]) {
                  
                } else {
                  contactArr.push({_id:'dataId_'+index, firstName:row[1], lastName:row[2], email:row[3], phone:row[4]});
                  template.selectedContacts.get().add('dataId_'+index);
                }
               } 
               index++;
            });
            
            template.contacts.set(contactArr);
            template.allSelected.set(true); 
            var selectedCount = template.selectedContacts.get()
            template.selectedContacts.set(selectedCount);
          }
        });
      };
      reader.readAsBinaryString(file);
    } else {
      CrossPlatform.alert({
          msg: TAPi18n.__('guests.extension_error'),
      });
      return false;
    }
    
      /*Papa.parse(evt.target.files[0], {
        complete: function(results) {
          console.log(results);
          return false;
          var index = 0;
          var contactArr = new Array();
          results.data.forEach((data) => {
             if(index != 0) {
              if(data[3] != '') {
                contactArr.push({_id:'dataId_'+index, firstName:data[1], lastName:data[2], email:data[3]});
              } else {
                contactArr.push({_id:'dataId_'+index, firstName:data[1], lastName:data[2], phone:data[4]});
              }
              template.selectedContacts.get().add('dataId_'+index);
             } 
             index++;
          });
          
          template.contacts.set(contactArr);
          template.allSelected.set(true); 
          var selectedCount = template.selectedContacts.get()
          template.selectedContacts.set(selectedCount);
        }
      });*/
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

  'click #add-guest-file-btn' (evt, template){
    if(Template.instance().selectedContacts.get().size == 0) {
      CrossPlatform.alert({
          msg: TAPi18n.__('guests.contact_file_error'),
      });
      return false;
    }

    let data =  Template.instance().contacts.get();
    let selectedContactIds = Array.from(template.selectedContacts.get());

    let eventId = Session.get('eventId');
    let {Email: emailReg, Phone: phoneReg} = SimpleSchema.RegEx;
    let invites = selectedContactIds.map(selectedContactId => {
      
      var result = Invites.findContactsUsingByIds(data,selectedContactId);
      
      var contactInfoPhone = '';
      var contactInfoEmail = '';
      if (emailReg.test(result.email)) {
        contactInfoEmail = result.email;
      }

      if (phoneReg.test(result.phone)) {
        contactInfoPhone = Utils.numbers(result.phone);
      }

      let guestInvite = {firstName: result.firstName, lastName: result.lastName, email: contactInfoEmail, phone: contactInfoPhone};
      guestInvite.eventId = eventId;
      
      if (Invites.verifyUniqueInvite(guestInvite)) {
         Meteor.call('Invites.insert', eventId, guestInvite); 
      }

      template.selectedContacts.set(new Set());
      template.allSelected.set(''); 
    });

    clearPastEventForm(evt, template);
    PM.set('add-guests-file-modal', null);
    //Meteor.call('Invites.insert', eventId, invites);
  },

  'click .select-all-files' (evt, template){
    let allSelected = Template.instance().allSelected.get();
    let allIds = $('ul.contacts-collection-files .personal-contact')
      .map(function() { return $(this).data('contact-id') })
      .toArray();

    updateSelectedContacts(function (selectedContacts) {
      allSelected ?
        allIds.forEach((id) => { selectedContacts.delete(id) }) :
        allIds.forEach((id) => { selectedContacts.add(id) }); 

      return selectedContacts;
    });

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
  $("#upload-contact-file").val('');
  template.contacts.set('');
}