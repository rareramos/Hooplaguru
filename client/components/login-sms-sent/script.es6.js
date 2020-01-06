Template.LoginSMSSent.helpers({
  sms (){
    return Session.get('successSMS');
  }
});

Template.LoginSMSSent.events({
  'click .transparent-login-btn' (){
    $('#login-input').val('');

    Session.set('overlayTemplate', null);

    Hoopla.transforms.hideModal({
      transition: 'blur',
      blurTarget: '.homepage-bg',
    });
  },
});
