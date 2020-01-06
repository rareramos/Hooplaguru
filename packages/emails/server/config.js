let {
  MANDRILL_API_USER,
  MANDRILL_API_KEY
} = Meteor.settings;

Mandrill.config({
  username: MANDRILL_API_USER,  // the email address you log into Mandrill with. Only used to set MAIL_URL.
  key: MANDRILL_API_KEY  // get your Mandrill key from https://mandrillapp.com/settings/index
  // port: 587,  // defaults to 465 for SMTP over TLS
  // host: 'smtp.mandrillapp.com',  // the SMTP host
  // baseUrl: 'https://mandrillapp.com/api/1.0/'  // update this in case Mandrill changes its API endpoint URL or version
});
