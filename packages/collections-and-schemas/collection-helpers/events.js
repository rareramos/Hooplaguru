Events.helpers({
  publicGroups (){
    return Groups.find({eventId: this._id, public: true});
  },

  inviteText (){
    let hostName = this.hostName();
    return TAPi18n.__('sms_notification.you_invite_to')+` '${this.title}',`+TAPi18n.__('sms_notification.hosted_by')+` ${hostName} `+TAPi18n.__('sms_notification.on')+` ${this.prettyStartTime()}!`
  },

  publicGroupsCount (){
    return this.publicGroups().count();
  },

  // legacy code, function name is not descriptive
  hosts (){
    return this.invitesToHostsCursor();
  },

  invitesToHostsCursor() {
    return Invites.find({eventId: this._id, isHost: true});
  },

  hostIds() {
    return this.invitesToHostsCursor()
      .map(lodash.property('userId'))
      .filter(Boolean);
  },

  isHost(userId) {
    return lodash.includes(this.hostIds(), userId);
  },

  invitesToGuestsCursor() {
    return Invites.find({eventId: this._id});
  },

  guestIds() {
    return this.invitesToGuestsCursor()
      .map(lodash.property('userId'))
      .filter(Boolean);
  },

  isGuest(userId) {
    return lodash.includes(this.guestIds(), userId);
  },

  guestEmails (){
    let emails = Invites.find({
      eventId: this._id, isHost: {$ne: true}
    }).map(guest => guest.email);

    return _.compact(emails);
  },

  guestPhones (){
    let phones = Invites.find({
      eventId: this._id, isHost: {$ne: true}
    }).map(guest => guest.phone);

    return _.compact(phones);
  },

  guestCount (){
    return Invites.find({eventId: this._id}).count();
  },

  uninvitedGuests (){
    return Invites.find({
      eventId: this._id, isHost: {$ne: true}, inviteStatus: 'not invited',
    }, {
      sort: {firstName: 1},
    });
  },

  uninvitedGuestIds (){
    return _.pluck(this.uninvitedGuests().fetch(), '_id');
  },

  uninvitedCount (){
    return this.uninvitedGuests().count();
  },

  invitedGuestIds (){
    let inviteIds = [];
    if(this._id && Meteor.user() && Meteor.user().isHost(this._id))
    {
      inviteIds = Groups.find({eventId: this._id}).map(group => group.inviteId);
    }
    else
    {
      inviteIds =  Invites.find({eventId: this._id}).map(group => group._id);
    }
    return _.compact(inviteIds);
  },

  yesGuests (){
    let invitedGuestIds = this.invitedGuestIds();

    return Invites.find({
      _id: {$in: invitedGuestIds},
      eventId: this._id,
      inviteStatus: 'attending',
    }, {
      sort: {firstName: 1},
    });
  },

  yesGuestsVisible (){
    return this.yesGuests().fetch()
      .filter(guest => ! guest.isHidden);
  },

  yesCount (){
    return this.yesGuests().count();
  },

  noGuests (){
    let invitedGuestIds = this.invitedGuestIds();

    return Invites.find({
      _id: {$in: invitedGuestIds},
      eventId: this._id,
      isHost: {$ne: true},
      inviteStatus: 'not attending',
    }, {
      sort: {firstName: 1},
    });
  },

  noCount (){
    return this.noGuests().count();
  },

  noReplyGuests (){
    let invitedGuestIds = this.invitedGuestIds();

    return Invites.find({
      _id: {$in: invitedGuestIds},
      eventId: this._id,
      isHost: {$ne: true},
      inviteStatus: 'no reply',
    }, {
      sort: {firstName: 1},
    });
  },

  noReplyCount (){
    return this.noReplyGuests().count();
  },

  noReplyGuestIds (){
    return _.pluck(this.noReplyGuests().fetch(), '_id');
  },
  
  getInvites (){
    return Invites.find({eventId: this._id, isHost: {$ne: true}});
  },

  getInvitedUserIds() {
    let userIds = this.getInvites().map(invite => invite.userId);

    return _.compact(userIds);
  },

  getInvitedEmails (){
    return _.compact(
      this.getInvites().map(invite => invite.email)
    );
  },

  hasContent (){
    return (
      this.title ||
      this.coverPhotoId ||
      this.description ||
      this.hasActivities()
    );
  },

  hasDraftEvent (){
    return (
      this.hasActivities() ||
      this.coverPhotoId
    );
  },

  hasCoverPhoto (){
    return this.coverPhotoId || this.blobCover;
  },

  schedule (){
    return Activities.find({eventId: this._id, creating: false}, {
      sort: {startTime: 1}
    });
  },

  firstActivity (){
    return this.schedule().fetch()[0];
  },

  hasActivities (){
    return this.schedule().count();
  },

  activityEndTimes (){
    return Activities.find({eventId: this._id}, {
      sort: {endTime: 1}
    });
  },

  posts (){
    return Posts.find({event: this._id}, {
      sort: {createdAt: 1}
    });
  },

  themeCss (){
    if (this.theme === 'dark') {
      return {
        gradient: 'rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5)',
        color:'#fff',
      };
    }

    return {
      gradient: 'rgba(255, 255, 255, 0), rgba(255, 255, 255, .75)',
      color:'#000',
    };
  },

  plannerName (){
    let name = Meteor.users.findOne(this.user).profile.fullName;

    return s.capitalize(name);
  },

  prettyStartTime (){
    return moment(this.eventStartTime).format('MMM D, YYYY');
  },

  hostName (){
    return Invites.find({eventId: this._id, isHost: true})
      .map(hostInvite => hostInvite.fullName());
  },

  formatEmailTime (){
    let startTime = this.eventStartTime;
    let endTimes = this.activityEndTimes().fetch();
    let schedule = this.schedule().fetch();
    if (endTimes.length === schedule.length) {
      let endTime = endTimes.pop().endTime;
      return (Hoopla.formatActivityDate(startTime, endTime)) + ' ' + (Hoopla.formatActivityTime(startTime, endTime));
    } else {
      return (Hoopla.formatActivityDate(startTime, null)) + ' ' + (Hoopla.formatActivityTime(startTime, null));
    }
  },

  // client side only
  setTheme (){
    if (!this.coverPhotoId) {
      return
    }

    getImageLightness($.cloudinary.url(this.coverPhotoId), brightness => {
      let theme = brightness && brightness > 180 ? 'light' : 'dark';

      Meteor.call(
        'Events.update',
        this._id,
        { $set: {theme} },
        (err, result) => {
          err && CrossPlatform.alert({msg: err})
        }
      );
    });
  },

  latestActivity (){
    let latestStartTime = this.latestStartTime();
    let latestEndTime = this.latestEndTime();

    if (latestEndTime && latestEndTime > latestStartTime){
      return latestEndTime;
    } else if (latestStartTime){
      return latestStartTime;
    } else {
       return false;
    }
  },

  latestEndTime() {
    let activities = Activities.find({eventId: this._id}).fetch();

    if (activities){
      let endTimes = activities.map(activity => activity.endTime);
      endTimes = _.compact(endTimes);

      if (endTimes.length) {
        let latestEndTime = _.max(endTimes);

        return latestEndTime;
      } else {
        return false;
      }
    } else {
      return false;
    }
  },

  latestStartTime() {
    let activities = Activities.find({eventId: this._id}).fetch();

    if (activities){
      let startTimes = activities.map(activity => activity.startTime);
      startTimes = _.compact(startTimes);

      if (startTimes.length) {
        let latestStartTime = _.max(startTimes);

        return latestStartTime;
      } else {
        return false;
      }
    } else {
      return false;
    }
  },

  latestActivityWithFalse (){
    let latestStartTime = this.latestStartTimeWithFalse();
    let latestEndTime = this.latestEndTimeWithFalse();

    if (latestEndTime && latestEndTime > latestStartTime){
      return latestEndTime;
    } else if (latestStartTime){
      return latestStartTime;
    } else {
       return false;
    }
  },

 latestEndTimeWithFalse() {
    let activities = Activities.find({eventId: this._id, creating: false}).fetch();

    if (activities){
      let endTimes = activities.map(activity => activity.endTime);
      endTimes = _.compact(endTimes);

      if (endTimes.length) {
        let latestEndTime = _.max(endTimes);
        return latestEndTime;
      } else {
        return false;
      }
    } else {
      return false;
    }
  },

  latestStartTimeWithFalse() {
    let activities = Activities.find({eventId: this._id, creating: false}).fetch();

    if (activities){
      let startTimes = activities.map(activity => activity.startTime);
      startTimes = _.compact(startTimes);

      if (startTimes.length) {
        let latestStartTime = _.max(startTimes);
        return latestStartTime;
      } else {
        return false;
      }
    } else {
      return false;
    }
  },

  getInvites (){
    return Invites.find({eventId: this._id})
  },

  eventUrl (eventNav=0){
    return Meteor.absoluteUrl(
      `events?event-nav=${eventNav}&event-id=${this._id}`
    );
  },

  generateMailData (invite){

    let schedule = this.schedule().fetch();
    
    var activityData = new Array();
    schedule.forEach((item) => { 
      activityData.push({'activityTitle':item.title, 'activityTime': Hoopla.formatActivityDate(item.startTime, item.endTime)+' '+Hoopla.formatActivityTime(item.startTime, item.endTime), 'activityLocation': item.address.locationName, 'activityAddress': item.address.address1});
    });

    //console.log(activityData);return false;
    /*var addressPart3 = '';
    this.formatEmailTime(),
    let fullAddress = schedule[0].address.address1;
    let addressArray = fullAddress.split(',');
    if (addressArray.length > 3) {
      addressPart3 = addressArray.pop()
    }
    let addressPart1 = addressArray.shift();
    let addressPart2 = addressArray.join(',');*/
    let hosts = this.hostName();

    let {
      logoUrl: logo, appStoreBadge, googlePlayBadge
    } = Meteor.settings.public;

    let eventLink;
    let {title: eventTitle, description: eventDescription} = this;

    if (invite) {
      eventLink = invite.rsvpUrl({autofill: true})
    } else {
      eventLink = this.eventUrl()
    }

    let image;
    if(this.isVideo == 0) {
      if (Cloudinary.url) {
        image = Cloudinary.url(this.coverPhotoId, {})

      } else {
        image = Cloudinary._helpers.url(this.coverPhotoId, {})
      }  
    } else {
      image = 'http://res.cloudinary.com/eventassist/video/upload/'+this.coverPhotoId+'.jpg'
    }
  
    
    let response = {
      logo,
      appStoreBadge,
      googlePlayBadge,
      url: this.eventUrl(),
      image,
      eventTitle,
      eventDescription,
      eventLink,
      hostName: hosts[0],
      yesLink: '',
      noLink: '',
      activityData:activityData
    };

    //console.log(response);return false;
    return response;
  },

  // client side
  generatePreviewMailData (){
    let schedule = this.schedule().fetch();

    var activityData = new Array();
    schedule.forEach((item) => { 
      activityData.push({'activityTitle':item.title, 'activityTime': Hoopla.formatActivityDate(item.startTime, item.endTime)+' '+Hoopla.formatActivityTime(item.startTime, item.endTime), 'activityLocation': item.address.locationName, 'activityAddress': item.address.address1});
    });

    /*var addressPart3 = '';
    let fullAddress = schedule[0].address.address1;
    let addressArray = fullAddress.split(',');
    if (addressArray.length > 3) {
      addressPart3 = addressArray.pop()
    }
    let addressPart1 = addressArray.shift();
    let addressPart2 = addressArray.join(',');*/
    let hosts = this.hostName();

    let previewMailData = {
      logo: Meteor.settings.public.logoUrl,
      appStoreBadge: Meteor.settings.public.appStoreBadge,
      googlePlayBadge: Meteor.settings.public.googlePlayBadge,
      url: '',
      image: this.isVideo == 1 ? $.cloudinary.url(this.posterId) : $.cloudinary.url(this.coverPhotoId) ,
      eventTitle: this.title,
      eventDescription: this.description,
      hostName: hosts[0],
      eventLink: '',
      yesLink: '',
      noLink: '',
      activityData:activityData
    }

    return previewMailData;
  },

  publicInviteUrl (){
    let group = Groups.findOne({eventId: this._id, public: true});

    return group.url();
  },

  eventImageSourceIds() {
    return this.eventImages().map(lodash.property('imageId'));
  },

  eventImages() {
    return EventImages.find({_id: {$in: this.eventImageIds}}).fetch();
  },

  eventImagesWithFilter(activityId) {
    
    if(activityId == 'All') {
      return EventImages.find({_id: {$in: this.eventImageIds}}).fetch();
    } else if(activityId) {
      return EventImages.find({_id: {$in: this.eventImageIds}, activityId : activityId}).fetch();
    }
    else {
      return EventImages.find({_id: {$in: this.eventImageIds}, activityId : null}).fetch();
    }
  },

  eventImagesOwn(userId) {
    return EventImages.find({_id: {$in: this.eventImageIds},userId: userId}).fetch();
  },
});
