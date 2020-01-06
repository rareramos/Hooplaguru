Template.ContactSupportForm.onCreated(function(){
  this.formError = new ReactiveVar();
  let template = this;
});

Template.ContactSupportForm.helpers({
  user (){
    return Meteor.user();
  },
  formError (){
    return Template.instance().formError.get();
  },
  getEmails (){
    if(Meteor.user().emails){
      return Meteor.user().emails[0].address;
    } else {
      return '';
    }
  },
  getEmailWarning() {
    return Session.get('emailWarning');
  },
  getSubjectWarning() {
    return Session.get('subjectWarning');
  },
  getMessageWarning() {
    return Session.get('messageWarning');
  },
  getContactSupport() {
    return TAPi18n.__('contact_support.contact_support');
  }
});

Template.ContactSupportForm.events({
  'click .contact-left-header' (e, template){
    resetWarnings();
    PM.set('contact-support-form', null);
    template.formError.set(null);
    AutoForm.resetForm('contact-support-form');
  },

  'click .right-header' (){
    Session.set('overlayTemplate', 'Loading');

    Meteor.logout(err => {
      Session.set('overlayTemplate', null);

      Meteor.setTimeout(() => {
        Materialize.toast(
          'Logged out successfully.', Hoopla.toastInterval, 'ea-toast'
        );
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

   'click #send-ticket' (e, template){
      
      template.formError.set(null);

      resetWarnings();
      var emailValid = validateEmail();
      var subjectValid = validateSubject();
      var messageValid = validateMessage();

      if (emailValid && subjectValid && messageValid) {

        Session.set('overlayTemplate', 'Loading'); 

        let getData = AutoForm.getFormValues('contact-support-form').insertDoc;
        
        var name = Meteor.user().fullName();
        var email = getData.emails;
        var subject = getData.subject;
        var message = getData.message;      
        loadingtext($(event.target));
        Meteor.call('createZendeskTicket', name, email, subject, message, (e, result) => {

          //if(!Meteor.user().emails){
            let modifier = {$set: {
              'emails': [{address:getData.emails}],
            }};
       
            Meteor.call('Users.update',Meteor.userId(),modifier);  
          //}
          Session.set('overlayTemplate', null); 
          PM.set('contact-support-form', null); 
          template.formError.set(null);
          AutoForm.resetForm('contact-support-form');
          CrossPlatform.alert({
              msg: TAPi18n.__('contact_support.succ_msg'),
          });

        })
      }
      
    },    

});


var validateEmail = () => {
  var email = $('#emails').val();

  if (email != '') {
    return true;

  } else {
    Session.set('emailWarning', true);
    return false;
  }
};

var validateSubject = () => {
  var subject = $('#subject').val();

  if (subject != '') {
    return true;

  } else {
    Session.set('subjectWarning', true);
    return false;
  }
};

var validateMessage = () => {
  var message = $('#message').val();

  if (message != '') {
    return true;

  } else {
    Session.set('messageWarning', true);
    return false;
  }
};

var resetWarnings = () => {

  Session.set('emailWarning', null);
  Session.set('subjectWarning', null);
  Session.set('messageWarning', null);
};