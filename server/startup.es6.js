Meteor.startup(() => {
  HooplaBot = new Chatterbox(Hoopla.bot.defaultName);


ServiceConfiguration.configurations.remove({service: "microsoft"}); 
    ServiceConfiguration.configurations.insert({
      service: "microsoft",
      clientId: Meteor.settings.public.OUTLOOK_CLIENT_ID,
      secret: Meteor.settings.public.OUTLOOK_SECRET,
      display: "popup",    
    });
    
// Configure our notification
 Push.debug = false;
 Push.Configure({
   "apn": {
     "passphrase": "123456",
     "keyData": Assets.getText('ios/apn-production/PushChatKey.pem'),
     "certData": Assets.getText('ios/apn-production/PushChatCert.pem'),
     "production": true
   },
   "gcm": {
     "apiKey": "AIzaSyCgF_QMZ-cHIb1jfekWpZUPkhmi2rBy0v8",
     "projectNumber": 211069606366,
     "production": true
   },
 });

  // Leave this here for quick bot testing

  //HooplaBot.listen(Posts, {
    //listenTo: 'body', listenFor: /event bot/, chatAs: 'userId'
  //}, (userId, post) => {
    //HooplaBot.chat(Posts, {chatAs: 'userId',
      //message: {
        //eventId: post.eventId,
        //createdAt: new Date(),
        //body: 'You called the event bot'
      //}
    //});
  //});
});
