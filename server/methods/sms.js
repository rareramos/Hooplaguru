Meteor.methods({
  'Server.Sms.send' ({to, from, body}){
    return SMS.sendSync({
      to,
      from,
      body
    });
  },

  'Server.Sms.sendPreviewInvite' (to, eventId, userId){
    const event = Events.findOne(eventId);
    const loginToken = Accounts._generateStampedLoginToken();
    Accounts._insertLoginToken(userId, loginToken);

    const linkPath = `events?event-nav=0&event-id=${event._id}&login-token=${loginToken.token}`
    console.log(Meteor.settings.public.iconUrl);
    const previewLink = DeepLinks.createLink({
      feature: 'preview invite',
      channel: 'sms',
      data: {
        '$deeplink_path': linkPath,
        '$og_title': Meteor.settings.public.APP_NAME,
        '$og_image_url': Meteor.settings.public.iconUrl
      }
    })
    return SMS.send({
      to,
      from: Meteor.settings.TWILIO_PHONE_NUMBER,
      body: `Sent with HooplaGuru\n\n`+
        `Preview : ${event.inviteText()}\n\n` +
        `View event details : \n` +
        `${previewLink}`
    });
  },

  'Server.Sms.sendAppInviteLink' (userId, {eventId = '', inviteId = ''}){
    check(userId, String)
    check(eventId, Match.Optional(String))
    check(inviteId, Match.Optional(String))

    const invite = Invites.findOne({_id: inviteId}) || {}
    const fetchedEventId = eventId || invite.eventId

    const user = Meteor.users.findOne({_id: userId})
    if (! user) { return }

    const loginToken = Accounts._generateStampedLoginToken()
    Accounts._insertLoginToken(userId, loginToken)

    const linkPath = `events?event-nav=0&event-id=${fetchedEventId}&login-token=${loginToken.token}`
    const inviteLink = DeepLinks.createLink({
      feature: 'app install via invite',
      channel: 'sms',
      data: {
        '$deeplink_path': linkPath,
        '$og_title': Meteor.settings.public.APP_NAME,
        '$og_image_url': Meteor.settings.public.iconUrl
      }
    })

    SMS.send({
      to: Utils.addCountrySign(user.profile.phone),
      from: Meteor.settings.TWILIO_PHONE_NUMBER,
      body: `HooplaGuru: Thanks for your response!\n\n` +
        `To experience all the features of this event like photo sharing,` +
        ` the Event Wall, and notifications from the host, download HooplaGuru for FREE!\n\n` +
        `${inviteLink}`
    });

    return inviteLink
  },

  'Server.Sms.sendWallpost' (eventId, userId,imp,body){
    check(eventId, String)
    check(userId, String)

    const invitesArr = Invites.find({eventId: eventId, inviteStatus: 'attending', userId: { $ne: userId }}) || {}
    //const fetchedEventId = eventId || invite.eventId

    const eventArr = Events.findOne({_id: eventId});

    invitesArr.forEach(function (invite) {
      
      user = Meteor.users.findOne({_id: invite.userId})
      if (! user) { return }

      const loginToken = Accounts._generateStampedLoginToken()
      Accounts._insertLoginToken(invite.userId, loginToken)
      const linkPath = `events?event-nav=1&event-id=${eventId}&login-token=${loginToken.token}`
      const inviteLink = DeepLinks.createLink({
            feature: 'host announcement',
            channel: 'sms',
            data: {
              '$deeplink_path': linkPath,
              '$og_title': Meteor.settings.public.APP_NAME,
              '$og_image_url': Meteor.settings.public.iconUrl,
              '$desktop_url': Meteor.absoluteUrl(linkPath),
              '$ios_url': Meteor.absoluteUrl(linkPath),
              '$ios_has_app_url': Meteor.absoluteUrl(linkPath),
              '$android_url': Meteor.absoluteUrl(linkPath)
            }
          })

      const linkPathPro = `events?event-nav=0&user-form=true&login-token=${loginToken.token}`
      const inviteLinkPro = DeepLinks.createLink({
            feature: 'host announcement',
            channel: 'sms',
            data: {
              '$deeplink_path': linkPathPro,
              //'$fallback_url': Meteor.absoluteUrl(linkPathPro),
              '$og_title': Meteor.settings.public.APP_NAME,
              '$og_image_url': Meteor.settings.public.iconUrl,
              '$desktop_url': Meteor.absoluteUrl(linkPathPro),
              '$ios_url': Meteor.absoluteUrl(linkPathPro),
              '$ios_has_app_url': Meteor.absoluteUrl(linkPathPro),
              '$android_url': Meteor.absoluteUrl(linkPathPro)
            }
          })

      if(user.profile.notifyflag || imp)
      {
        if(!invite.isEnablePush)
        {
          SMS.send({
            to: Utils.addCountrySign(user.profile.phone),
            from: Meteor.settings.TWILIO_PHONE_NUMBER,
            body: body + ` View Event : \n` + inviteLink 
          });  
        }
        else
        {
          Meteor.call('userNotification','HooplaGuru',eventArr.title + ' : ' + body,{userId: user._id}, eventArr._id)
        }
      }
      else
      {
        count = parseInt(user.profile.notifycount) + 1;
        if(count == 10)
        {
          count = 0;
          falseNot = `There are 10 pending messages on the HooplaGuru wall, click here to view them : \n` + inviteLink 
          if(!invite.isEnablePush)
          {
            SMS.send({
              to: Utils.addCountrySign(user.profile.phone),
              from: Meteor.settings.TWILIO_PHONE_NUMBER,
              body: falseNot
            });
          }
          else
          {
            falseNot = `There are 10 pending messages on the HooplaGuru wall.`
            Meteor.call('userNotification','HooplaGuru',body,{userId: user._id})
          }
        }

        modifier = {$set: {
          'profile.notifycount': count.toString()
        }};
        Meteor.call('Users.update', user._id, modifier);
      }
    });
  },

  'Server.Sms.sendComment' (postId, userId, body){
    check(postId, String)
    check(userId, String)
    let post = Posts.findOne(postId);

    if(!post) {
      post =  EventImages.findOne({imageId: postId});
    }

    const eventArr =  Events.findOne({_id: post.eventId});


    // user = Meteor.users.findOne({_id: post.userId})

    // if (! user) { return }

    // if(userId != user._id)
    // {
    //   SMS.send({
    //     to: user.profile.phone,
    //     from: Meteor.settings.TWILIO_PHONE_NUMBER,
    //     body: body + inviteLink
    //   });
    // }

    const invitesArr = Invites.find({eventId: post.eventId, inviteStatus: 'attending', userId: { $ne: userId }}) || {}

    invitesArr.forEach(function (invite) {
      
      user = Meteor.users.findOne({_id: invite.userId})
      if (! user) { return }

      const loginToken = Accounts._generateStampedLoginToken()
      Accounts._insertLoginToken(invite.userId, loginToken)
      const linkPath = `events?event-nav=1&event-id=${post.eventId}&login-token=${loginToken.token}`
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

      const linkPathPro = `events?event-nav=0&user-form=true&login-token=${loginToken.token}`
      const inviteLinkPro = DeepLinks.createLink({
            feature: 'host announcement',
            channel: 'sms',
            data: {
              '$deeplink_path': linkPathPro,
              //'$fallback_url': Meteor.absoluteUrl(linkPathPro),
              '$og_title': Meteor.settings.public.APP_NAME,
              '$og_image_url': Meteor.settings.public.iconUrl,
              '$desktop_url': Meteor.absoluteUrl(linkPathPro),
              '$ios_url': Meteor.absoluteUrl(linkPathPro),
              '$ios_has_app_url': Meteor.absoluteUrl(linkPathPro),
              '$android_url': Meteor.absoluteUrl(linkPathPro)
            }
          })

      if(user.profile.notifyflag || user._id == post.userId)
      {
        if(user._id == post.userId)
        {
          body = body.replace('#username#','your');
        }
        else
        {
          userOwn = post.username();
          body = body.replace('#username#',userOwn  + "'s");
        }

        if(!invite.isEnablePush)
        {
          SMS.send({
            to: Utils.addCountrySign(user.profile.phone),
            from: Meteor.settings.TWILIO_PHONE_NUMBER,
            body: body + ` View Event : \n` + inviteLink 
          });
        }
        else
        {
          Meteor.call('userNotification','HooplaGuru',eventArr.title + ' : ' + body,{userId: user._id}, eventArr._id)
        }
      }
      else
      {
        count = parseInt(user.profile.notifycount) + 1;
        if(count == 10)
        {
          count = 0;
          falseNot = `There are 10 pending messages on the HooplaGuru wall, click here to view them : \n` + inviteLink
          if(!invite.isEnablePush)
          {
            SMS.send({
              to: Utils.addCountrySign(user.profile.phone),
              from: Meteor.settings.TWILIO_PHONE_NUMBER,
              body: falseNot
            });
          }
          else
          {
            falseNot = `There are 10 pending messages on the HooplaGuru wall.`
            Meteor.call('userNotification','HooplaGuru',body,{userId: user._id})
          }
        }
        
        modifier = {$set: {
          'profile.notifycount': count.toString()
        }};
        Meteor.call('Users.update', user._id, modifier);
      }
    });
  },

  'Server.Sms.sendnotifystatus' (to,body) {
    SMS.send({
          to: Utils.addCountrySign(to),
          from: Meteor.settings.TWILIO_PHONE_NUMBER,
          body: body
        });
  },

  'Server.Sms.sendWallpostVer2' (eventId, userId,imp,body){
    check(eventId, String)
    check(userId, String)

    const invitesArr = Invites.find({eventId: eventId, inviteStatus: 'attending', userId: { $ne: userId }}) || {}
    //const fetchedEventId = eventId || invite.eventId

    const eventArr =  Events.findOne({_id: eventId});

    invitesArr.forEach(function (invite) {
      
      user = Meteor.users.findOne({_id: invite.userId})
      if (! user) { return }

      const loginToken = Accounts._generateStampedLoginToken()
      Accounts._insertLoginToken(invite.userId, loginToken)
      const linkPath = `events?event-nav=1&event-id=${eventId}&login-token=${loginToken.token}`
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

      const linkPathPro = `events?event-nav=0&user-form=true&login-token=${loginToken.token}`
      const inviteLinkPro = DeepLinks.createLink({
            feature: 'host announcement',
            channel: 'sms',
            data: {
              '$deeplink_path': linkPathPro,
              //'$fallback_url': Meteor.absoluteUrl(linkPathPro),
              '$og_title': Meteor.settings.public.APP_NAME,
              '$og_image_url': Meteor.settings.public.iconUrl,
              '$desktop_url': Meteor.absoluteUrl(linkPathPro),
              '$ios_url': Meteor.absoluteUrl(linkPathPro),
              '$ios_has_app_url': Meteor.absoluteUrl(linkPathPro),
              '$android_url': Meteor.absoluteUrl(linkPathPro)
            }
          })

      if(invite.isSMSNotification || imp)
      {
        //if(!invite.isEnablePush)
        //{
          SMS.send({
            to: Utils.addCountrySign(user.profile.phone),
            from: Meteor.settings.TWILIO_PHONE_NUMBER,
            body: body + ` View Event : \n` + inviteLink
          });  
        //}
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
          falseNot = `There are 10 pending messages on the HooplaGuru wall, click here to view them : \n` + inviteLink
          
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
    });
  },

  'Server.Sms.sendCommentVer2' (postId, userId, body){ 
    check(postId, String)
    check(userId, String)
    let post = Posts.findOne(postId);

    if(!post) {
      post =  EventImages.findOne({imageId: postId});
    }

    const eventArr =  Events.findOne({_id: post.eventId});


    // user = Meteor.users.findOne({_id: post.userId})

    // if (! user) { return }

    // if(userId != user._id)
    // {
    //   SMS.send({
    //     to: user.profile.phone,
    //     from: Meteor.settings.TWILIO_PHONE_NUMBER,
    //     body: body + inviteLink
    //   });
    // }

    const invitesArr = Invites.find({eventId: post.eventId, inviteStatus: 'attending', userId: { $ne: userId }}) || {}

    invitesArr.forEach(function (invite) {
      
      user = Meteor.users.findOne({_id: invite.userId})
      if (! user) { return }

      const loginToken = Accounts._generateStampedLoginToken()
      Accounts._insertLoginToken(invite.userId, loginToken)
      const linkPath = `events?event-nav=1&event-id=${post.eventId}&login-token=${loginToken.token}`
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

      const linkPathPro = `events?event-nav=0&user-form=true&login-token=${loginToken.token}`
      const inviteLinkPro = DeepLinks.createLink({
            feature: 'host announcement',
            channel: 'sms',
            data: {
              '$deeplink_path': linkPathPro,
              //'$fallback_url': Meteor.absoluteUrl(linkPathPro),
              '$og_title': Meteor.settings.public.APP_NAME,
              '$og_image_url': Meteor.settings.public.iconUrl,
              '$desktop_url': Meteor.absoluteUrl(linkPathPro),
              '$ios_url': Meteor.absoluteUrl(linkPathPro),
              '$ios_has_app_url': Meteor.absoluteUrl(linkPathPro),
              '$android_url': Meteor.absoluteUrl(linkPathPro)
            }
          })

      if(user._id == post.userId)
      {
        body = body.replace('#username#','your');
      }
      else
      {
        userOwn = post.username();
        body = body.replace('#username#',userOwn  + "'s");
      }

      if(invite.isSMSNotification || user._id == post.userId)
      {
        //if(!invite.isEnablePush)
        //{
          SMS.send({
            to: Utils.addCountrySign(user.profile.phone),
            from: Meteor.settings.TWILIO_PHONE_NUMBER,
            body: body + ` View Event : \n` + inviteLink
          });
        //}
        
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
          falseNot = `There are 10 pending messages on the HooplaGuru wall, click here to view them : \n` + inviteLink
          
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
    });
  },


});
