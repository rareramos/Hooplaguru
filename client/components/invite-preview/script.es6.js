Template.InvitePreview.onCreated(function(){
  this.formError = new ReactiveVar();
});

Template.InvitePreview.helpers({
  formError (){
    return Template.instance().formError.get();
  },

  userPhoneNumber (){
    return Meteor.user().profile.phone;
  },
});

Template.InvitePreview.events({
  'click #send-preview-invite' (evt, template){
    template.formError.set(null);

    let {Email: emailRegex, Phone: phoneRegex} = SimpleSchema.RegEx;
    let input = $('.preview-invite-input').val();
    let event = Events.findOne(Session.get('eventId'));

    if (! input) { 
      template.formError.set(TAPi18n.__('guests.phone_email_error'));
      return 
    }

    loadingtext($(event.target));
    let phone = Utils.numbers(input);

    if (phoneRegex.test(phone)) {
      Meteor.call('Server.Sms.sendPreviewInvite', Utils.addCountrySign(phone), event._id, Meteor.userId());
      resetAndClose();

    } else if (emailRegex.test(input)) {
      let previewMailData = event.generatePreviewMailData();

      Meteor.call('Server.Emails.sendPreviewInvite', input, event, previewMailData);
      resetAndClose();

    } else {
      template.formError.set(TAPi18n.__('guests.phone_email_error'));
    }
  },

  'click #cancel-preview-invite' (){
    loadingtext($(event.target));
    resetAndClose();
  },

  'click #clear-preview-invite-input' (evt, template){
    $('.preview-invite-input').val('');
    template.formError.set(null);
  },

  'click #invite-email' (evt, template){
    $('#invite-email input').prop('checked', true);
    $('#invite-phone input').prop('checked', false);
    /*$('.preview-invite-input').inputmask({
      mask: "*{1,20}[.*{1,20}][.*{1,20}][.*{1,20}]@*{1,20}[.*{2,6}][.*{1,2}]",
      greedy: false,
      onBeforePaste: function (pastedValue, opts) {
        pastedValue = pastedValue.toLowerCase();
        return pastedValue.replace("mailto:", "");
      },
      definitions: {
        '*': {
          validator: "[0-9A-Za-z!#$%&'*+/=?^_`{|}~\-]",
          cardinality: 1,
          casing: "lower"
        }
      }
    });*/
    $('.preview-invite-input').val(Meteor.user().primaryEmail());
    template.formError.set(null);
  },

  'click #invite-phone' (evt, template){
    $('#invite-phone input').prop('checked', true);
    $('#invite-email input').prop('checked', false);
    //$('.preview-invite-input').inputmask("(999) 999-9999");
    $('.preview-invite-input').val(Meteor.user().profile.phone);
    template.formError.set(null);
  }
});

var resetAndClose = () => {
  AutoForm.resetForm('preview-invite-form');
  PM.set('invite-preview', null);
};

Template.InvitePreview.onRendered(function () {
    $('#invite-phone input').prop('checked', true);
    //$('.preview-invite-input').inputmask("(999) 999-9999");
})
