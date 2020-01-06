Meteor.methods({
  'Server.Emails.sendLogin' (user, email){
    check(user, Object);
    check(email, String);

    return Emails.sendLogin(user, email);
  },

  'Server.Emails.sendInvite' ({email, event, mailData}){
    check(email, String);
    check(event, Object);
    check(mailData, Object);

    return Emails.sendInvite(email, event, mailData);
  },

  'Server.Emails.sendPreviewInvite' (email, event, previewMailData){
    check(email, String);
    check(event, Object);
    check(previewMailData, Object);

    return Emails.sendPreviewInvite(email, event, previewMailData);
  },

  'Server.Emails.sendAnnouncement' ({email, event, mailData}){
    check(email, String);
    check(event, Object);
    check(mailData, Object);

    return Emails.sendAnnouncement(email, event, mailData);
  },
});
