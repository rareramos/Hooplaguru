Meteor.methods({
  'Server.Login.sendCode' (phone){
    check(phone, String);

    let getPhone = Utils.numbers(phone);
    let user = Meteor.users.findOne({'phone.number': getPhone});
    if (user) {
      LoginService.sendLoginCode(user._id, phone);

    } else {
      LoginService.createUserViaPhone(phone, {
        sendCode: true
      });
    }
  },
});
