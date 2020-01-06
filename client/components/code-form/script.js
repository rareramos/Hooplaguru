Template.CodeForm.helpers({
  phoneNumber (){
      Meteor.setTimeout(() => {
        //Session.set('loginTemplate', 'CodeForm');
          Session.set('overlayTemplate', null);
      }, 2000);
    return Session.get('phoneInput') || '';
  },   
});

Template.CodeForm.events({
  'click .onboard-link' (){
    Session.set('loginTemplate', 'PhoneForm');
    Session.set('phoneInput', null);
  },

  'keyup #code-form' (){
    let phone = $('#code-input').val();
    let status = phone.length >= 4 ? null : true;

    $('#code-submit').attr('disabled', status);
  },

  'submit #code-form' (e, template){
    Utils.stopEvent(e);

    let code = Utils.numbersFrom('#code-input');
    let phone = Utils.numbers(Session.get('phoneInput'));

    if (! (code || phone)) { return }

    Session.set('startingOverlayTemplate', true);
    Session.set('overlayTemplate', 'Loading');

    Accounts.loginByPhone(code, phone, (e, success) => {
      Session.set('overlayTemplate', null);
      
      if (e) {
        return CrossPlatform.alert({
          msg: 'User not found with that code. Please try again.',
        });
      }

      let { firstName } = Meteor.user().profile;

      if (firstName) {
        Router.go('events');

      } else {
        Session.set('loginTemplate', 'GetUsersName');
      }
    });
  },
});
