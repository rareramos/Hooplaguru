PersonalContacts = {
  _contacts: [],
  _updatedAt: ReactiveVar(new Date()),

  init: function () {
    
    CrossPlatform.findContacts(this._insertContacts.bind(this));
  },

  findByKeyword: function (nameKeyword, limit=Infinity) {
    this._updatedAt.get();

    return lodash(this._contacts).filter(function(contact){
      return !nameKeyword || (
        contact.name &&
        contact.name.formatted &&
        lodash.includes(
          contact.name.formatted.toLowerCase(), nameKeyword.toLowerCase()
        )
      )
    }).take(limit).value();
  },

  findByIds: function (ids) {
    let idsSet = new Set(ids);
    return _.filter(this._contacts, function (contact) {
      return idsSet.has(contact._id)
    });
  },

  _insertContacts: function (rawContacts) {
    this._contacts = lodash(rawContacts)
      .map(this._seperateEmailsAndPhones)
      .flatten()
      .map(this._formatContact)
      .sortBy('name.formatted')
      .value();
    this._updatedAt.set(new Date());
  },

  _seperateEmailsAndPhones: function ({name, emails, phoneNumbers}) {
    let emailContacts = (emails       || []).map(email       => { return { name, email }});
    let phoneContacts = (phoneNumbers || []).map(phoneNumber => { return { name, phone: phoneNumber }});
    return emailContacts.concat(phoneContacts);
  },

  _formatContact: function (contact, _id) {
    contact._id = _id;
    contact.type  = lodash.get(contact, 'email.type')  ||
      lodash.get(contact, 'phone.type');
    contact.value = lodash.get(contact, 'email.value') ||
      Utils.formatPhone(lodash.get(contact, 'phone.value'));
    return contact;
  },
}

// NOTE: do not delete this, this is a reference to the schema of the contacts
// let contactsSchema = new SimpleSchema({
//   _id: {
//     type: String
//   },
//   name: {
//     type: Object
//   },
//   'name.givenName': {
//     type: String
//   },
//   'name.familyName': {
//     type: String,
//     optional: true
//   },
//   'name.formatted': {
//     type: String
//   },
//   'email.type': {
//     type: String,
//     optional: true,
//   },
//   'email.value': {
//     type: String,
//     optional: true,
//   },
//   'phone.type': {
//     type: String,
//     optional: true,
//   },
//   'phone.value': {
//     type: String,
//     optional: true
//   },
// });
