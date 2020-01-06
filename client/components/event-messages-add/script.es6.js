Template.EventsMessagesAdd.onRendered(function(){
	this.contacts                  = new ReactiveVar([]);
	this.selectedContacts          = new ReactiveVar(new Set());
	this.allSelected               = new ReactiveVar();
});

Template.EventsMessagesAdd.helpers({
	adduserLists() {
		
		var isHost = Meteor.user().isHost(Session.get('eventId'));

		if(isHost) {

			let groupArr = [{_id: 'yes', 'firstName': TAPi18n.__('event_nav.rsvp'),'lastName': TAPi18n.__('guests.yes')},{_id: 'no', 'firstName': TAPi18n.__('event_nav.rsvp'),'lastName': TAPi18n.__('guests.no')},{_id: 'norply', 'firstName': TAPi18n.__('event_nav.rsvp'),'lastName': TAPi18n.__('guests.no_reply')}];
			let listUser = Invites.find({eventId: Session.get('eventId'), userId: {$ne: Meteor.userId()}, inviteStatus: {$ne: 'not invited'}},{fields: {'_id': 1,'firstName': 1,'lastName': 1, 'isHost': 1}});
			groupArr = groupArr.concat(listUser.fetch());
			return groupArr;
		} else {

			let listUser = Invites.find({eventId: Session.get('eventId'), userId: {$ne: Meteor.userId()}, inviteStatus: {$ne: 'not invited'}},{fields: {'_id': 1,'firstName': 1,'lastName': 1, 'isHost': 1}}).fetch();
			return listUser;
		}
	},

	allSelected (){
	    return Template.instance().allSelected.get();
	},

	selectAllText (){
	    let allSelected = Template.instance().allSelected.get();
	    if(allSelected) {
	    	return TAPi18n.__('message.deselect_all');
	    } else {
	      	return TAPi18n.__('message.select_all');
	    }
	},

	allSelectedIcon (){
	    let allSelected = Template.instance().allSelected.get();
	    if(allSelected) {
	    	return '/icons/form-checkbox-on@2x.png';
	    } else {
		    return '/icons/form-checkbox-off@2x.png';
	    }
	},

	checkboxIcon (){
		let isSelected = Template.instance().selectedContacts;
	    if(isSelected && isSelected.get().has(this._id)) {
	    	return '/icons/form-checkbox-on@2x.png';
	    } else {
		    return '/icons/form-checkbox-off@2x.png';
	    }
	},
	messageTitle(){
	  return TAPi18n.__('message.message');
	}
});

Template.EventsMessagesAdd.events({
	'click .left-header' (evt, template){
		//Session.set("testting","asdasdasd");
		template.selectedContacts.set(new Set());
		template.allSelected.set('');
		PM.set('msg-detail-modal', null);
		PM.set('msg-add-modal', null);
	},


	'click .select-all' (evt, template){
	    let allSelected = Template.instance().allSelected.get();
	    let allIds = $('ul.contacts-collection-messages .personal-contact')
	      .map(function() { return $(this).data('contact-id') })
	      .toArray();

	    updateSelectedContacts(function (selectedContacts) {
	        if(allSelected) {
	        	allIds.forEach((id) => { selectedContacts.delete(id) });
	        } else {
 	        	allIds.forEach((id) => { selectedContacts.add(id) });
	        }

	      	return selectedContacts;
	    });

	    Template.instance().allSelected.set(!allSelected);
	},

	'click .personal-contact' (){
	    let contactId = this._id;

	    updateSelectedContacts(function (selectedContacts) {
	      if(selectedContacts.has(contactId)) {
	        selectedContacts.delete(contactId);
	      } else {
 	        selectedContacts.add(contactId);
	      }

	      return selectedContacts;
	    })
  	},

  	'click #add-msg-to-btn' (evt, template){
  		loadingtext($(evt.target));
  		Session.set('msg-to-ids', [...Template.instance().selectedContacts.get()]);
  		template.selectedContacts.set(new Set());
		template.allSelected.set('');
		PM.set('msg-add-modal', null);
  	}
});

function updateSelectedContacts (callback) {
  let selectedContactsReactiveVar = Template.instance().selectedContacts;
  let previousContacts            = selectedContactsReactiveVar.get();
  let currentContacts             = callback(previousContacts);
  selectedContactsReactiveVar.set(currentContacts);
}