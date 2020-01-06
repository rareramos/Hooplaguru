CrossPlatform = {};

CrossPlatform.alert = ({
  msg, callback = () => {}, title = 'Alert', buttonText = 'OK'
}) => {
  if (Meteor.isCordova && navigator.notification) {
    return navigator.notification.alert(
      msg, callback, title, buttonText
    );
  }

  alert(msg);
  callback();
};

CrossPlatform.confirm = ({
  msg, callback, title = 'Confirm', buttonNames = ['Cancel', 'OK']
}) => {
  if (Meteor.isCordova && navigator.notification) {
    return navigator.notification.confirm(
      msg, callback, title, buttonNames
    );
  }

  if (window.confirm(msg)) {
    callback(2);

  } else {
    callback(1);
  }
};

CrossPlatform.findContacts = (callback) => {
  if (Meteor.isCordova && navigator.contacts) {
    navigator.contacts.find(['*'], callback);
  } else {
    // NOTE: this is for testing only, there is no contact list in the broswer
    // let fakeContacts = lodash.range(1, 1000).map(function (index) {
    //   return {
    //     name: {
    //       givenName: 'given' + index,
    //       familyName: 'family' + index,
    //       formatted: 'given' + index + ' family' + index,
    //     },
    //     emails: [
    //       {
    //         type: 'work',
    //         value: 'workemail' + index + '@gmail.com',
    //       },
    //       {
    //         type: 'home',
    //         value: 'homeemail' + index + '@gmail.com',
    //       },
    //     ],
    //     phoneNumbers: [
    //       {
    //         type: 'mobile',
    //         value: '(123) 456-7890'
    //       }
    //     ]
    //   }
    // })

    // callback(fakeContacts)
  }
};
