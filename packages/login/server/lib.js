let {
  BITLY_USERNAME,
  BITLY_API_KEY,
  TWILIO_ACCOUNT_SID,
  TWILIO_ACCOUNT_TOKEN,
  TWILIO_PHONE_NUMBER
} = Meteor.settings;

bitly = new Bitly(BITLY_USERNAME, BITLY_API_KEY);

  // for accounts-passwordless package
twilio = {
  sid: TWILIO_ACCOUNT_SID,
  auth: TWILIO_ACCOUNT_TOKEN,
  from: TWILIO_PHONE_NUMBER,
};

  // for accounts-phone package
Meteor.startup(() => {
  let client = Twilio(TWILIO_ACCOUNT_SID, TWILIO_ACCOUNT_TOKEN);

  SMS.twilio = {
    ACCOUNT_SID: TWILIO_ACCOUNT_SID,
    AUTH_TOKEN: TWILIO_ACCOUNT_TOKEN
  };

  SMS.sendSync = Meteor.wrapAsync(client.sendMessage, client);
});

  // for accounts-phone package
Meteor.startup(() => {
  Accounts._options.verificationMaxRetries = 99;
});
