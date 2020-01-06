Template.ActivityDetails.helpers({
  staticMapUrl (){
    return this.buildMapUrl()
  },

  hasTransitOrAttire (){
    return this.transit || this.attire;
  },

  hasMapUrl (){
    return this.address && this.address.address1;
  },

  mapLink (){
    if (Meteor.isCordova && device) {
      if (isIOS(device)) {
        return this.buildiOSMapLink();
      } else {
        return this.buildWebMapLink();
      }
    } else {
      return this.buildWebMapLink();
    }
  },
});
