Template.EventDetails.onCreated(function(){
  if (! this.data) { return }

  this.data.autofillFirstName = PM.get('first-name');
  this.data.autofillLastName  = PM.get('last-name');
  this.data.autofillPhone     = PM.get('phone');
  this.data.canNotEditPhone   = Boolean(PM.get('sign-in-token'));

  this.autorun(() => {
    const user = Meteor.user()
    if (! user || (! user.profile.phone)) { return }

    this.data.autofillPhone = user.profile.phone
    this.data.canNotEditPhone = true
  })
});

Template.EventDetails.onRendered(function(){
  $('#rsvp-form').keyup();
});


Template.EventDetails.helpers({
  
  getCountryCode() {

    $.get("https://ipinfo.io", function(response) {
  
      let result = Countries.findOne({cn_iso_2:response.country});

      $('#countryCode').val('+'+result.cn_phone);
      var codeSession = Session.get('currentCountryCode'); 

      if(codeSession) {
        Session.set('currentCountryCode', codeSession); 
      } else {
        Session.set('currentCountryCode', result.uid);
        $('#countryCode').val('+'+result.cn_phone);   
      }

    }, "jsonp");
  },

  rsvpEventTitle() {

    return TAPi18n.__("guests.rsvp_event");
  },

  firstnameTitle() {
    return TAPi18n.__("guests.firstname");
  },
  lastnameTitle() {
    return TAPi18n.__("guests.lastname");
  },

  hostTitle (){
    return TAPi18n.__("events.hosts");
  },
  scheduleTitle (){
    return 'Plan Event Schedule';
  },

  checkPastEvent() {

    const events = Events.findOne({
      _id: this.event._id, creating: false
    });
    
    Meteor.subscribe('hosts',events._id);
    const now = new Date();
    const eventEndTime = new Date(moment(events.eventEndTime).tz('UTC').format('dddd, MMM D YYYY, h:mm a'));

    if (eventEndTime && eventEndTime > now) {
      return true;
    } else {
      return false;
    }
  }
});

Template.EventDetails.events({

  'click .countryCodeInput' (e,template){

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