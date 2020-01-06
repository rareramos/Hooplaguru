Template.PhoneForm.events({
  'keyup #phone-form' (){
    let phone = $('#phone-input').val();

    $('#phone-submit').attr('disabled', phone.length < 10);
  },

  'submit #phone-form' (e){
    Utils.stopEvent(e);
    let coutryCode = $('.country-code').val();
    let phone;
    if(coutryCode == '+1') {

      phone = Utils.numbersFrom('#phone-input');
    } else {

      phone = coutryCode+Utils.numbersFrom('#phone-input');  
    }
    

    Session.set('phoneInput', phone);

    if (phone) {
      Meteor.call('Server.Login.sendCode', phone);
      Session.set('overlayTemplate', "Loading");
      Session.set('loginTemplate', 'CodeForm');
    }
  },

  'click .country-code' (e,template){

    new Confirmation({
      message: $("#my-popup-box").html(),
      title: TAPi18n.__('login.select_country'),
      cancelText: TAPi18n.__('general.cancel'),
      okText: TAPi18n.__('general.ok'),
      success: true, // whether the button should be green or red
      focus: "cancel" // which button to autofocus, "cancel" (default) or "ok", or "none"
    }, function (ok) {
        if(ok) {
          $(".country-code").val($(".selected-coutry-code").val());
          $(".coutrycodelist").children("li").stop().show();
        } else{
          $(".coutrycodelist").children("li").stop().show();
        }
    });
  },

  'click .language-link' (event,template){
    
    var lang = event.currentTarget.id;
    
    TAPi18n.setLanguage(lang)
      .done(function () {
        Session.set("currentLanguage", lang);
      })
      .fail(function (error_message) {
        // Handle the situation
        console.log(error_message);
    });
  },

  'click .syncCountries' (event,template){
    console.log('clicked');
    Meteor.call('syncCountryDatabase', (e, result) => {

      if(e){
        console.log(e);
      } else {
        console.log(result);
      }
    });
  },

});

Template.PhoneForm.onRendered(function () {
    $('#phone-input').inputmask("(999) 999-9999");
    Session.set('currentCountryCode', '');
})

Template.PhoneForm.helpers({
  getCurrentCountryCode() {
    
    $.get("https://ipinfo.io", function(response) {
      
      const handle = Meteor.subscribe('countries-single',{'cn_iso_2':response.country});
       
     Tracker.autorun(() => {
        const isReady = handle.ready();
         
        if(isReady) {
          let result = Countries.find({'cn_iso_2':response.country}).fetch();
          var codeSession = Session.get('currentCountryCode'); 
          
          if(codeSession && codeSession != '') {
            Session.set('currentCountryCode', codeSession); 
          } else {
            
            Session.set('currentCountryCode', result[0].uid);
            $('.country-code').val('+'+result[0].cn_phone);   
          }
        } else {
          Session.set('currentCountryCode', '');
          $('.country-code').val('+1');
        }
      });
      
    }, "jsonp");
  },

});


