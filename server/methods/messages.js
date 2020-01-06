Meteor.methods({

  'Server.Messages.insert' (data){
    Messages.insert(data);
    //console.log(data);
    /*const invitesArr = Invites.find({eventId: data.eventId, inviteStatus: 'attending', _id: { $in: data.toUser }, _id: { $ne: data.fromUser }}) || {}
    const fromuser = Invites.findOne({_id: data.fromUser})

    const eventArr = Events.findOne({_id: data.eventId});
    const body = fromuser.firstName+` sent you a Private Message : "${data.message}"`;

    invitesArr.forEach(function (invite) {
      
      user = Meteor.users.findOne({_id: invite.userId})
      if (! user) { return }

      const loginToken = Accounts._generateStampedLoginToken()
      Accounts._insertLoginToken(invite.userId, loginToken)
      const linkPath = `events?event-nav=4&event-id=${data.eventId}&msg-detail-modal=${data.conversationId}&login-token=${loginToken.token}`
      const inviteLink = DeepLinks.createLink({
            feature: 'host announcement',
            channel: 'sms',
            data: {
              '$deeplink_path': linkPath,
              //'$fallback_url': Meteor.absoluteUrl(linkPath),
              '$og_title': Meteor.settings.public.APP_NAME,
              '$og_image_url': Meteor.settings.public.iconUrl,
              '$desktop_url': Meteor.absoluteUrl(linkPath),
              '$ios_url': Meteor.absoluteUrl(linkPath),
              '$ios_has_app_url': Meteor.absoluteUrl(linkPath),
              '$android_url': Meteor.absoluteUrl(linkPath)
            }
          })

      if(invite.isSMSNotification)
      {
          SMS.send({
            to: Utils.addCountrySign(user.profile.phone),
            from: Meteor.settings.TWILIO_PHONE_NUMBER,
            body: body + ` View Event : \n` + inviteLink
          });  
      }

      if(invite.isEnablePush)
      {
        Meteor.call('userNotification','HooplaGuru',eventArr.title + ' : ' + body,{userId: user._id}, eventArr._id)
      }
      
      if(!invite.isSMSNotification && !invite.isEnablePush)
      {
        if(invite.notifycount != undefined) {
          count = parseInt(invite.notifycount) + 1;
        } else {
          count = 1;
        }       
        
        if(count == 10)
        {
          count = 0;
          falseNot = `There are 10 pending messages on the HooplaGuru private message, click here to view them : \n` + inviteLink
          
            SMS.send({
              to: Utils.addCountrySign(user.profile.phone),
              from: Meteor.settings.TWILIO_PHONE_NUMBER,
              body: falseNot
            });
        }

        modifier = {$set: {
          'notifycount': count.toString()
        }};
        Meteor.call('Invites.update', invite._id, modifier);
      }

    });*/

  },

  'Server.Messages.update' (id,data){
    
    Messages.update({_id: id},{ $push: data });

  },

});
