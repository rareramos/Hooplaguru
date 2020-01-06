Emails = {};

Emails.sendTemplateSync = Meteor.wrapAsync(Mandrill.messages.sendTemplate);

Emails.sendPreviewInvite = (email, event, mailData) => {
  let mandrillRequest = Emails.generateMandrillRequest(
    'event-invite-with-activity', `Preview: You've been invited to ${event.title}.`, email, mailData
  );

  return Emails.sendTemplateSync(mandrillRequest);
};

Emails.sendInvite = (email, event, mailData) => {

  let metadata = {eventId: event._id};
  let mandrillRequest = Emails.generateMandrillRequest(
    'event-invite-with-activity', `You've been invited to ${event.title}.`, email, mailData, metadata
  );

  return Emails.sendTemplateSync(mandrillRequest);
};

Emails.sendAnnouncement = (email, event, mailData) => {
  let mandrillRequest = Emails.generateMandrillRequest(
    'host-announcement', `There is a host announcement for ${event.title}`, email, mailData
  );

  return Emails.sendTemplateSync(mandrillRequest);
};

Emails.generateMandrillRequest = (template_name, subject, email, mailData, metadata) => {

  mailData.appStoreUrl = Hoopla.appStoreUrl;
  mailData.googlePlayUrl = Hoopla.googlePlayUrl;
  
  let request = {
    template_name,
    template_content: [{
      name: 'body',
      content: '',
    }],
    message: {
      subject,
      from_email: Hoopla.email.from,
      to: [{email}],
      "merge_language": "handlebars",
      "merge": true,
      global_merge_vars: Emails.createMergeVars(mailData),
    },
  };
  
  if (metadata) { request.message.metadata = metadata }

  return request;
};

Emails.createMergeVars = mailData => {
  return Object.keys(mailData).map(dataKey => {
    return {
      name: dataKey,
      content: mailData[dataKey]
    };
  });
};

Emails.dispatchMandrillWebhook = (request) => {
  let webhookJSON;

  try {
    webhookJSON = JSON.parse(request.body.mandrill_events);
  } catch (err){
    console.log(err);
  }

  if (webhookJSON) {
    let webhookBody = webhookJSON[0];

    if (webhookBody.msg && webhookBody.msg.metadata) {
      let eventId = webhookBody.msg.metadata.eventId;
      let email = webhookBody.msg.email;
      let webhookEvent = webhookBody.event;
      let invite = Invites.findOne({eventId: eventId, email: email});

      if (webhookEvent && webhookEvent === 'open'){
        let modifier = {$set: {
          mailStatus: 'opened'
        }};
        Meteor.call('Invites.update', invite._id, modifier);
      } else if (webhookEvent && webhookEvent === 'hard_bounce'){
        let modifier = {$set: {
          mailStatus: 'bounced'
        }};
        Meteor.call('Invites.update', invite._id, modifier);
      }
    }
  }
};

Emails.changenotifyStatus = (notifyData) => {
 
   var rawIn = this.request.body;
 
   if (rawIn.Body) {
     msg = rawIn.Body;
   }
   else {
    return;
   }
   //const msg = 'STOP';
   const no = rawIn.From;
   let modifier = {},msgBody;
 
   if(msg == 'STOP')
   {
     modifier = {$set: {
           'notifyflag': false,
           'notifycount': '0'
         }};
 
     msgBody = "HooplaGuru: You will no longer receive the Wall messages.";
 
   }
   else if(msg == 'START')
   {
     modifier = {$set: {
          'notifyflag': true,
           'notifycount': '0'
         }};
 
     msgBody = "HooplaGuru: You will start receiving the Wall messages again.";
   }
   else {
     return;
   }
   
   user = Meteor.users.findOne({phone: {number: no}});
 
   Meteor.call('Users.update', user._id, modifier);
 
   Meteor.call('Server.Sms.sendnotifystatus', no, msgBody, (e, success) => {
     if (e) {
       CrossPlatform.alert({msg: e})
     }
   });
 
 };
