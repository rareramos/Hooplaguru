Template.Index.onCreated(function(){
  this.formHidden = new ReactiveVar();
  this.formError = new ReactiveVar();
});

Template.Index.helpers({
  overlayTemplate (){
    return Session.get('overlayTemplate')
  },

  formHidden (){
    return Template.instance().formHidden.get();
  },

  formError (){
    return Template.instance().formError.get();
  },
});

Template.Index.events({
  'submit #login-form' (e, template) {
    resetFormState(e, template);

    let input = e.target['login-input'].value;

    if (! input) {
      Session.set('overlayTemplate', null);
      return template.formError.set('Please enter a valid email address');
    }

    input = input.toLowerCase();
    let query = {'emails.address': input};

    Meteor.call('Server.Users.findOne', query, (err, user) => {
      if (user) {
        Meteor.call('Server.Emails.sendLogin', user, input);
        Session.set('successEmail', input);
        blurInModal('LoginEmailSent');

      } else {
        Session.set('Meteor.users.new', {input, profile: {}})
        blurInModal('GetUsersName');
      }
    });
  },
});

Template.Index.onDestroyed(function(){
  Session.set('overlayTemplate', null);
  this.formHidden.set(null);
  this.formError.set(null);

  Session.set('successEmail', null);
  Session.set('Meteor.users.new', null);
});

let blurInModal = template => {
  $('#login-input').blur();

  Hoopla.transforms.showModal({
    transition: 'blur',
    blurTarget: '.homepage-bg',
    complete (){
      Session.set('overlayTemplate', template);
    }
  });
};

let resetFormState = (evt, template) => {
  Utils.stopEvent(evt);
  template.formError.set(null);
  Session.set('overlayTemplate', 'Loading');
};
