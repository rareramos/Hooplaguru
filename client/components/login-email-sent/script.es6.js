Template.LoginEmailSent.helpers({
  email (){
    return Session.get('successEmail');
  },

  welcomeText (){
    if (Session.get('newEmailLogin')) {
      return 'Welcome!';
    } else {
      return 'Welcome back!';
    }
  }
});

Template.LoginEmailSent.events({
  'click .transparent-login-btn' (){
    $('#login-input').val('');

    Session.set('overlayTemplate', null);

    Hoopla.transforms.hideModal({
      transition: 'blur',
      blurTarget: '.homepage-bg',
    });
  },
});
