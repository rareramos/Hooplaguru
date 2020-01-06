Accounts.oauth.tryConnectAfterPopupClosed = function(credentialToken, callback) {
  console.log(credentialToken);
  var credentialSecret = OAuth._retrieveCredentialSecret(credentialToken) || null;
  console.log(credentialSecret);
  Meteor.call('connectUserWithMicrosoft', credentialToken, credentialSecret, function() {
    if (!!callback)
      callback(arguments);
  });
};

Accounts.oauth.credentialRequestForConnectCompleteHandler = function(callback) {
  return function (credentialTokenOrError) {
    if(credentialTokenOrError && credentialTokenOrError instanceof Error) {
      callback && callback(credentialTokenOrError);
    } else {
      Accounts.oauth.tryConnectAfterPopupClosed(credentialTokenOrError, callback);
    }
  };
};

Meteor.connectWithMicrosoft = function(options, callback) {
  // support a callback without options
  if (! callback && typeof options === "function") {
    callback = options;
    options = null;
  }

  var credentialRequestCompleteCallback = Accounts.oauth.credentialRequestForConnectCompleteHandler(callback);
  Microsoft.requestCredential(options, credentialRequestCompleteCallback);
};
