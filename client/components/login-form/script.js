Template.LoginForm.events({
  'submit #login-input' (e){
    Utils.stopEvent(e);

    let phone = $('#phone-number').val();
    Meteor.call('Server.Login.sendCode', phone, (err, result) => {

    });
  }
});
