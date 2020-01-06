Meteor.methods({
  'Server.Posts.sendAnnouncements' (post, event, mailData){
    check(post, Object);
    check(event, Object);

      // event has to be fetched again because document loses collection
      // helpers ability when sent from client to server
    const fetchedEvent = Events.findOne({_id: event._id});

    const invites = Invites.find({
      eventId: event._id,
      $or: [
        {inviteStatus: {$ne: 'not invited'}},
        {mailStatus: {$ne: 'not sent'}}
      ]
    }).fetch().filter(invite => {
      return (
        invite.userId &&
        invite.userId !== this.userId
      )
    }).map(invite => {
      const user = Meteor.users.findOne({_id: invite.userId});
      const channels = {}

      const loginToken = Accounts._generateStampedLoginToken()
      Accounts._insertLoginToken(invite.userId, loginToken)
      const linkPath = `events?event-nav=1&event-id=${fetchedEvent._id}&login-token=${loginToken.token}`

      if (user.phone && user.phone.number) {
        const {hostName} = mailData;
        const hostAnnouncementLink = DeepLinks.createLink({
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

        channels.sms = {
          to: user.phone.number,
          from: Meteor.settings.TWILIO_PHONE_NUMBER,
          body: `HooplaGuru: ${hostName} says:\n\n` +
            `${post.body}\n\n` +
            `View event:\n` +
            `${hostAnnouncementLink}`
        }
      }

      if (user.primaryEmail()) {
        const emailLink = DeepLinks.createLink({
          feature: 'host announcement',
          channel: 'email',
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

        mailData.eventLink = emailLink

        channels.email = {
          event,
          email: user.primaryEmail(),
          mailData
        };
      }

      return MsgBus.send('hostAnnouncement', channels, {sendAll: true})
    })
  },
});

