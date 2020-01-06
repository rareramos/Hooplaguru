Groups = new Mongo.Collection('groups');

Groups.attachSchema(new SimpleSchema({
  name: {
    type: String,
    optional: true,
  },
  limit: {
    type: Number,
    defaultValue: 1,
  },
  eventId: {
    type: String
  },
  public: {
    type: Boolean,
    defaultValue: false,
  },
  active: {
    type: Boolean,
    defaultValue: false,
  },
  inviteId: {
    type: String,
    optional: true,
  },
  url: {
    type: String,
    optional: true
  },
  code: {
    type: String,
    optional: true,
  },
}));

Groups.helpers({
  //url (){
    //let url = Hoopla.groupBaseUrl + this.code;

    //if (this.inviteId) {
      //return `${url}/${s.decapitalize(this.guestFirstName())}`;

    //} else {
      //return `${url}/public`;
    //}
  //},

  guestFirstName (){
    let invite = Invites.findOne({_id: this.inviteId});

      // in case someone tries to sneak in a middle name
    return invite && invite.firstName.split(' ')[0];
  },

  attendingGuests (){
    return Invites.find({
      groupId: this._id, _id: {$ne: this.inviteId}, inviteStatus: 'attending'
    });
  },

  notAttendingGuests (){
    return Invites.find({
      groupId: this._id, _id: {$ne: this.inviteId}, inviteStatus: 'not attending'
    });
  },

  noReplyGuests (){
    return Invites.find({
      groupId: this._id, _id: {$ne: this.inviteId}, inviteStatus: 'no reply'
    });
  },

  canShowResendInvite (){
    let personalInvite = Invites.findOne({_id: this.inviteId});

    if (personalInvite) {
      return personalInvite.inviteStatus === 'no reply';
    }
  },
});

Groups.activateGroup = _id => {
  Groups.update({_id}, {$set: {active: true}});
};

Groups.isActiveGroup = _id => {
  let group = Groups.findOne({_id});

  return group.active || group.public;
};

Groups.hasRoom = _id => {
  let group = Groups.findOne({_id});
  let {inviteId, limit} = group;

  let baseQuery = {
    isHost: {$ne: true}, groupId: _id
  };

  let query = inviteId ? {...baseQuery, _id: {$ne: inviteId}} : baseQuery;
  let guestCount = Invites.find(query).count();

  return guestCount < limit;
};

let addCodeToNewGroup = (userId, doc) => {
  doc.code = Utils.randomCode(6);
};

let addGroupIdToNewInvite = (userId, {inviteId, _id}) => {
  if (inviteId) {
    Invites.update({_id: inviteId}, {$set: {groupId: _id}});
  }
};

Groups.before.insert(addCodeToNewGroup);
Groups.after.insert(addGroupIdToNewInvite);

if (Meteor.isServer) {
  const createPublicGroupLink = function(userId, group){
    if (! group.public) { return }

    const deepLinkPath = `${group.code}/public`

    const deepLink = DeepLinks.createLink({
      feature: 'public group invite',
      channel: group.eventId,
      data: {
        '$deeplink_path': deepLinkPath,
        //'$fallback_url': Meteor.absoluteUrl(deepLinkPath),
        '$og_title': Meteor.settings.public.APP_NAME,
        '$og_image_url': Meteor.settings.public.iconUrl,
        '$desktop_url': Meteor.absoluteUrl(deepLinkPath),
        '$ios_url': Meteor.absoluteUrl(deepLinkPath),
        '$ios_has_app_url': Meteor.absoluteUrl(deepLinkPath),
        '$android_url': Meteor.absoluteUrl(deepLinkPath)
      }
    })

    Groups.update({_id: group._id}, {$set: {url: deepLink}})
  }

  const createPersonalGroupLink = function(userId, group){
    if (group.public) { return }

    const fetchedGroup = Groups.findOne({_id: group._id})
    const firstName = s.decapitalize(fetchedGroup.guestFirstName())
    const deepLinkPath = `${fetchedGroup.code}/${firstName}`

    const deepLink = DeepLinks.createLink({
      feature: 'personal group invite',
      channel: fetchedGroup.eventId,
      data: {
        '$deeplink_path': deepLinkPath,
        //'$fallback_url': Meteor.absoluteUrl(deepLinkPath),
        '$og_title': Meteor.settings.public.APP_NAME,
        '$og_image_url': Meteor.settings.public.iconUrl,
        '$desktop_url': Meteor.absoluteUrl(deepLinkPath),
        '$ios_url': Meteor.absoluteUrl(deepLinkPath),
        '$ios_has_app_url': Meteor.absoluteUrl(deepLinkPath),
        '$android_url': Meteor.absoluteUrl(deepLinkPath)
      }
    })

    Groups.update({_id: fetchedGroup._id}, {$set: {url: deepLink}})
  }

  Groups.after.insert(createPublicGroupLink)
  Groups.after.insert(createPersonalGroupLink)
}
