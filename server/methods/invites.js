const XLSX = require('xlsx');

Meteor.methods({
  'Server.Invites.register' (rsvpFields, linkIsFromSMS){
    check(rsvpFields, Object);

    let sendCode = !linkIsFromSMS;

    let {
      _id, firstName, lastName, phone, inviteStatus, groupId, eventId
    } = rsvpFields;

    let existingInvite = Invites.findOne({_id});

    if (linkIsFromSMS) {
      if (! existingInvite) {
        if (! Groups.isActiveGroup(groupId)) {
          throw new Meteor.Error('This group is not yet active.');
        }

        if (! Groups.hasRoom(groupId)) {
          throw new Meteor.Error("This group has already reached it's guest limit.");
        }

        let newInviteFromSms = {firstName, lastName, phone, inviteStatus, groupId, eventId};
        let newInviteFromSmsId = Invites.insert(newInviteFromSms);

        return Invites.processRegistration({
          _id: newInviteFromSmsId, existingInvite: newInviteFromSms, rsvpFields, sendCode
        });
      }

      if (existingInvite.phone && existingInvite.phone !== phone) {
        if (this.userId) {
          const loggedInUser = Meteor.users.findOne({_id: this.userId})
          const {phone: loggedInPhone} = loggedInUser.profile

          existingInvite.phone = Utils.stripUSCountryCode(loggedInPhone)
          rsvpFields.phone = Utils.stripUSCountryCode(loggedInPhone)

        } else {
          throw new Meteor.Error('You can not change your mobile number.');
        }
      }
    }

    if (existingInvite && existingInvite.isHost) {
      throw new Meteor.Error('You are already hosting this event.');

    } else if (existingInvite) {

      let userId = Invites.processRegistration({
        _id: existingInvite._id, existingInvite, rsvpFields, sendCode
      });

      Groups.activateGroup(groupId);
      return userId;
    }

    if (! Groups.isActiveGroup(groupId)) {
      throw new Meteor.Error('This group is not yet active.');
    }

    let existingRsvp = Invites.findOne({eventId, phone, groupId});

    if (existingRsvp && existingRsvp.isHost) {
      throw new Meteor.Error('You are already hosting this event.');

    } else if (existingRsvp) {
      return Invites.processRegistration({
        _id: existingRsvp._id, existingInvite: existingRsvp, rsvpFields, sendCode
      });
    }

    if (! Groups.hasRoom(groupId)) {
      throw new Meteor.Error("This group has already reached it's guest limit.");
    }

    let newInvite = {firstName, lastName, phone, inviteStatus, groupId, eventId};
    let newInviteId = Invites.insert(newInvite);

    return Invites.processRegistration({
      _id: newInviteId, existingInvite: newInvite, rsvpFields, sendCode
    });
  },

  'Server.Invites.sendMultiple' (inviteIds){
    return Invites.find({_id: {$in: inviteIds}}).map(invite => {
      const channels = {}
      const socialchannels = {}

      if (invite.email) {
        const email = Invites.prepareEmailData(invite);
        const eventDeepLink = DeepLinks.createLink({
          feature: 'invite',
          channel: 'email',
          data: {
            '$deeplink_path': email.mailData.eventLink,
            //'$fallback_url': Meteor.absoluteUrl(email.mailData.eventLink),
            '$og_title': Meteor.settings.public.APP_NAME,
            '$og_image_url': Meteor.settings.public.iconUrl,
            '$desktop_url': Meteor.absoluteUrl(email.mailData.eventLink),
            '$ios_url': Meteor.absoluteUrl(email.mailData.eventLink),
            '$ios_has_app_url': Meteor.absoluteUrl(email.mailData.eventLink),
            '$android_url': Meteor.absoluteUrl(email.mailData.eventLink)
          }
        });

        email.mailData.eventLink = eventDeepLink
        channels.email = email
      }

      if (invite.phone) {
        const smsData = Invites.prepareSmsData(invite)
        if (smsData) { channels.sms = smsData }
      }

      if(invite.twitterId)
      {
        const twitData = Invites.prepareTwitData(invite)
        
        var Twit = Meteor.npmRequire('twit');

        var T = new Twit({
            consumer_key:         Meteor.settings.public.TWITTER_CUSTOMER_KEY, // API key
            consumer_secret:      Meteor.settings.public.TWITTER_CUSTOMER_SECRET,
            access_token:         Meteor.users.findOne({_id: Meteor.userId()}).services.twitter.accessToken, 
            access_token_secret:  Meteor.users.findOne({_id: Meteor.userId()}).services.twitter.accessTokenSecret
        });

        T.post('direct_messages/new',
            {
                user_id: invite.twitterId,
                text: twitData.body
            },
            Meteor.bindEnvironment(function(err, data, response) {
                if(data)
                {
                  Invites.update({_id: invite._id}, {
                    $set: {inviteStatus: 'no reply', mailStatus: 'sent'}
                  });
                }
            })
        );
      }



      if (MsgBus.send('invite', channels)) {
        return Invites.update({_id: invite._id}, {
          $set: {inviteStatus: 'no reply', mailStatus: 'sent'}
        });
      }
    });
  },

  'Server.Invites.getUserTokenFromInviteToken' (userId, inviteId, signInToken) {
    let invite = Invites.findOne(inviteId)
    let tokenIsCorrect = invite.signInToken === signInToken &&
      invite.userId === userId

    if (!tokenIsCorrect) {
      throw new Meteor.Error('not-authorized', 'your invite sign in token is invalid')
    } else {
      let stampedLoginToken = Accounts._generateStampedLoginToken();
      Accounts._insertLoginToken(userId, stampedLoginToken);
      return stampedLoginToken.token;
    }
  },

  'updatepushstatus' (inviteId, param) {
      Invites.update({_id: inviteId},param);
      return true;
   },

  'outlookuserlist' (userId) {
      let accessTokenArr = Meteor.users.findOne({_id: userId}).services;
      console.log(accessTokenArr);
      if(accessTokenArr.microsoft)
      {
        console.log(accessTokenArr.microsoft);
        accessToken = accessTokenArr.microsoft.accessToken;
        let res = HTTP.call( 'GET', 'http://apis.live.net/v5.0/me/contacts?access_token='+accessToken, {});
        return res;  
      }
      else
      {
        return false;
      }
    },

  'Server.Invites.uploadFile' (bstr, name) {
    /* read the data and return the workbook object to the frontend */
    return XLSX.read(bstr, {type:'binary'});
  },
});
