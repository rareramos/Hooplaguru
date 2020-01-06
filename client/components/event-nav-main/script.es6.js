Template.EventNavMain.helpers({
  
});

Template.EventNavMain.events({
  'click #closehamburgerbtn' (){
    $("#mySidenav").css("width","0");
  },
  'click .edit-my-profile' (){
    PM.set('user-form', true);
    $("#mySidenav").css("width","0");
  },
  'click .contact-support-btn' (evt){
    loadingtext($(event.target));
    $("#mySidenav").css("width","0");
    PM.set('contact-support-form', true);
  },
  'click .menu-logout-btn' (){
    $("#mySidenav").css("width","0");
    Session.set('overlayTemplate', 'Loading');
    Session.set('currentCountryCode', null);

    Meteor.logout(err => {
      Session.set('overlayTemplate', null);
      Materialize.toast(
          TAPi18n.__('users.logout_user'), Hoopla.toastInterval, 'ea-toast'
        );
      /*Meteor.setTimeout(() => {
        Materialize.toast(
          TAPi18n.__('users.logout_user'), Hoopla.toastInterval, 'ea-toast'
        );
        
      }, 500);*/
    });
  },
});