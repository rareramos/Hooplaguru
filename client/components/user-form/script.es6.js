Template.UserForm.helpers({
  user (){
    return Meteor.user();
  },
  isnotifyEnable (){
     user = Meteor.users.findOne({_id: Meteor.userId()})
     return user.profile.notifyflag;
  },
  getFirstname() {
    return TAPi18n.__('users.firstname');
  },
  getLastname() {
    return TAPi18n.__('users.lastname');
  },
  getEmail() {
    return TAPi18n.__('users.email');
  },
  getNumber() {
    return TAPi18n.__('users.number');
  },
  getSaveChanges() {
    return TAPi18n.__('users.save');
  },
  getAccount() {
    return TAPi18n.__('event_nav_main.myprofile');
  },
  getLogout() {
    return TAPi18n.__('users.logout');
  },
  selectedLanguage(val) {
    if(Meteor.user().profile.userLang === val) {
      return 'selected';
    }
  }
});

Template.UserForm.events({
  'click .left-header' (){
    PM.set('user-form', null);
  },

  'click .right-header' (){
    
    Session.set('getLogoutSession', true);
    Session.set('overlayTemplate', 'Loading');
    Session.set('currentCountryCode', null);
    
    Meteor.logout(err => {
      Session.set('overlayTemplate', null);

      Meteor.setTimeout(() => {
        Materialize.toast(
          TAPi18n.__('users.logout_user'), Hoopla.toastInterval, 'ea-toast'
        );
        Session.set('getLogoutSession', null);
      }, 500);
    });
  },

  'click #toggle_reminders' (){
     let modifier = {$set: {
       'profile.notifyflag': $(event.target).is(":checked"),
       'profile.notifycount': '0'
     }};
 
     Meteor.call('Users.update', Meteor.userId(),modifier);
   },

   'click .contact-support-btn-data' (evt){
    loadingtext($(event.target));
     PM.set('contact-support-form', true);
   },

   'click #toggle_reminders' (){
     let modifier = {$set: {
       'profile.notifyflag': $(event.target).is(":checked"),
       'profile.notifycount': '0'
     }};
 
     Meteor.call('Users.update', Meteor.userId(),modifier);
   },

   'submit #user-form' (){
      
      Session.set('overlayTemplate', 'Loading'); 
      loadingtext($("#user-form button"));
      Meteor.setTimeout(() => {
        Session.set('overlayTemplate', null); 
      }, 1000);
      
   },

   'change #lanugage-select' (evt,template){
      var langId = template.find('#lanugage-select').value;

      TAPi18n.setLanguage(langId)
      .done(function () {
        Session.set("currentLanguage", langId);
        let modifier = {$set: {
           'profile.userLang': langId
        }};
     
        Meteor.call('Users.update', Meteor.userId(),modifier);

      })
      .fail(function (error_message) {
        // Handle the situation
        console.log(error_message);
      });
   }
});
