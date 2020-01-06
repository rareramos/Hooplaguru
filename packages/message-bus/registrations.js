MsgBus.register('invite', {
  push: 'Server.Push.send',
  email: 'Server.Emails.sendInvite',
  sms: 'Server.Sms.send',
});

MsgBus.register('hostAnnouncement', {
  email: 'Server.Emails.sendAnnouncement',
  push: 'Server.Push.send',
  sms: 'Server.Sms.send',
});
