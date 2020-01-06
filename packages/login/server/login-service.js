LoginService = {};

LoginService.sendLoginCode = (userId, phone) => {
  Accounts.sendLoginSms(userId, phone, twilio, Hoopla.loginSmsText);
};

LoginService.createUserViaPhone = (phone, {sendCode} = {}) => {
  let userId = Accounts.createUserWithPhone({
    phone,
    profile: {phone},
  });

  if (sendCode) {
    LoginService.sendLoginCode(userId, phone);
  }

  return userId;
};

LoginService.createUserViaInvite = (
  {phone, email, firstName, lastName}, {sendCode} = {}
) => {
  let userId = Accounts.createUserWithPhone({
    phone,
    profile: {
      phone,
      email,
      firstName,
      lastName,
    },
  });

  if (sendCode) {
    LoginService.sendLoginCode(userId, phone);
  }

  return userId;
};
