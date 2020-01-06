Template.GuestListHeader.helpers({
  guestListTitle (numGuests){
    if (! numGuests) {
      return TAPi18n.__('guests.no_guest_attending');
    } else if (numGuests === 1) {
      return `${numGuests} `+TAPi18n.__('guests.guest_attending');
    } else {
      return `${numGuests} `+TAPi18n.__('guests.guests_attending');
    }
  }
});
