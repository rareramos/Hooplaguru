Template.Popup.events({

});

Template.Popup.onRendered(function () {

    Session.set('currentCountryCode', '');
})

Template.Popup.helpers({

  get_countries() {
    Meteor.subscribe('countries');
    return Countries.find().fetch();
  },

  getCurrentCountries() {
    Meteor.subscribe('countries');
    var currentCode = Session.get('currentCountryCode');
   
    if(currentCode) {
      
      var getData = Countries.findOne({uid : currentCode}); 
      
      if(getData) {
        $(".icon-code-"+currentCode).attr('src','/icons/form-checkbox-on@2x.png');
        $(".selected-coutry-code").val('+'+getData.cn_phone);
        return getData;
      }
    } else {
      return '';
    }
  }, 

  currentCountryCode() {

    return Session.get('currentCountryCode');
  },

  compareCurrentCode(a,b) {

    return a != b;
  }

});
