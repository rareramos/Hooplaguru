Meteor.startup(() => {
  const {ENABLE_ANALYTICS, SEGMENT_API_KEY} = Meteor.settings.public
  if (! ENABLE_ANALYTICS) { return }

  analytics.load(SEGMENT_API_KEY);

  if (Meteor.isClient) {
    Tracker.autorun((computation) => {
      const user = Meteor.user()
      if (! user) { return }

      const userData = {
        traits: {
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.profile.phone,
        }
      }

      if (user.primaryEmail()) {
        userData.traits.email = user.primaryEmail()
      }

      analytics.identify(user._id, userData)

      if (Meteor.isCordova) {
        Appsee.setUserId(user.profile.phone || user._id)
      }

      computation.stop()
    })
  }
})

