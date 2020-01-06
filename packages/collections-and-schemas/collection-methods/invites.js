Invites.toggleHidden = invite => {
  const modifier = {$set: {
    isHidden: !invite.isHidden
  }};

  Meteor.call('Invites.update', invite._id, modifier);
};

Invites.formatGuestInfo = ({emailOrPhone,countryCode, ...rest}) => {
  let {Email: email, Phone: phone} = SimpleSchema.RegEx;
  
  if (email.test(emailOrPhone)) {
    return {...rest, email: emailOrPhone};

  } else if (phone.test(emailOrPhone)) {

    if(countryCode == '+1') {
      return {...rest, phone: emailOrPhone};
    } else if(emailOrPhone.length <= 10 && countryCode) {
      return {...rest, phone: countryCode+emailOrPhone};
    } else {
      return {...rest, phone: emailOrPhone};
    }

  } else {
    return {...rest};
  }
};

Invites.formatUploadContactInfo = ({phone,email, ...rest}) => {
  let {Email: emailReg, Phone: phoneReg} = SimpleSchema.RegEx;

  if (emailReg.test(email)) {
    return {...rest, email: email};

  }  
  if (phoneReg.test(phone)) {
    return {...rest, phone: Utils.numbers(phone)};
  } else {
    return {...rest};
  }
};

Invites.formatHostInfo = ({phone, ...fields}) => {
  let phoneNumber = Utils.numbers(phone);
  let {Phone: phoneRegex} = SimpleSchema.RegEx;

  if (phoneRegex.test(phoneNumber)) {
    return {...fields, phone: phoneNumber};

  } else {
    return {...fields};
  }
};

Invites.formatContactInfo = ({name, phone, email, isSelected, ...rest}) => {
  let {givenName: firstName, familyName: lastName} = name;
  let contact = {firstName, lastName, ...rest};

  if (phone) {
    return {...contact, phone: Utils.numbers(phone.value)};

  } else {
    return {...contact, email: email.value};
  }
};

Invites.findExistingInvite = ({eventId, email, phone}) => {
  return Invites.findOne({
    eventId,
    $or: [
      {email: {$exists: true, $not: {$ne: email}}},
      {phone: {$exists: true, $not: {$ne: phone}}},
    ],
  });
};

Invites.verifyUniqueInvite = ({eventId, email, phone}) => {
  let duplicate = Invites.findOne({
    eventId,
    $or: [
      {email: {$exists: true, $not: {$ne: email}}},
      {phone: {$exists: true, $not: {$ne: phone}}},
    ],
  });

  return !duplicate;
};

Invites.findContactsUsingByIds = (data, idToLookFor) => {
  var categoryArray = data;
    for (var i = 0; i < data.length; i++) {
        if (data[i]._id == idToLookFor) {
            return(data[i]);
        }
    }
};

if (Meteor.isServer) {
  Invites.processRegistration = ({_id, existingInvite, rsvpFields, sendCode}) => {
    let {
      firstName, lastName, phone, inviteStatus, groupId
    } = rsvpFields;

    let phonesms =  Utils.addCountrySign(phone);
    let rsvpFieldsForSMS = {
      firstName, lastName, phone:phonesms, inviteStatus, groupId
    };

    let userId = Meteor.users.findOrCreateViaInvite(
      phone, rsvpFieldsForSMS, {sendCode}
    );

    Invites.update({_id}, {$set: {
      ...existingInvite, firstName, lastName, phone, inviteStatus, userId
    }});

    return userId;
  };

  Invites.preparePushData = (invite) => {
    let {userId, eventId} = invite;
    if (!userId) { return }

    let event = Events.findOne(eventId);

    return {
      title,
      text: `${event.inviteText()}`,
      query: {userId: {$in: [userId]}},
      payload: {
        route: 'event',
        eventId
      }
    };
  };

  Invites.prepareSmsData = (invite) => {
    if (! invite.phone) { return }

    let event = Events.findOne(invite.eventId);
    let deepLinkPath = invite.rsvpUrl({autofill: true, sendSignInToken: true});

    const inviteLink = DeepLinks.createLink({
      feature: 'invite',
      channel: 'sms',
      data: {
        '$deeplink_path': deepLinkPath,
        '$og_title': Meteor.settings.public.APP_NAME,
        '$og_image_url': Meteor.settings.public.iconUrl,
        '$desktop_url': Meteor.absoluteUrl(deepLinkPath),
        '$ios_url': Meteor.absoluteUrl(deepLinkPath),
        '$ios_has_app_url': Meteor.absoluteUrl(deepLinkPath),
        '$android_url': Meteor.absoluteUrl(deepLinkPath)
      }
    })

    if (! inviteLink) { return }

    let inviteLink1 = inviteLink.replace("http:","https:");

    return {
      to: Utils.addCountrySign(invite.phone),
      from: Meteor.settings.TWILIO_PHONE_NUMBER,
      body: `Sent with HooplaGuru \n\n`+
        `${event.inviteText()}\n\n` +
        `View event details: \n ` +

        `${inviteLink1}`

    };
  };

  Invites.prepareEmailData = invite => {
    if (! invite.email) { return }

    let event = Events.findOne({_id: invite.eventId});
    let {email} = invite;
    let mailData = event.generateMailData(invite);

    return {
      email, event, mailData
    };
  };

  Invites.prepareTwitData = invite => {
    let event = Events.findOne(invite.eventId);
    let deepLinkPath = invite.rsvpUrl({autofill: true});

    const inviteLink = DeepLinks.createLink({
      feature: 'invite',
      channel: 'sms',
      data: {
        '$deeplink_path': deepLinkPath,
        '$og_title': Meteor.settings.public.APP_NAME,
        '$og_image_url': Meteor.settings.public.iconUrl,
        '$desktop_url': Meteor.absoluteUrl(deepLinkPath),
        '$ios_url': Meteor.absoluteUrl(deepLinkPath),
        '$ios_has_app_url': Meteor.absoluteUrl(deepLinkPath),
        '$android_url': Meteor.absoluteUrl(deepLinkPath)
      }
    })

    if (! inviteLink) { return }

    return {
      body: `${event.inviteText()}\n\n` +
        `View event details:\n` +
        `${inviteLink}\n\n` +
        `Sent with HooplaGuru`
    };
  };
}
