Template.Events.onCreated(() => {
  
  Session.set('startingOverlayTemplate', false);
  if (PM.isRegistered('event-id')) { return }

  PM.register('event-id', Params.eventId);
  PM.register('event-nav', Params.eventNav);
  PM.register('event-nav-main', Params.eventNavMain);
  PM.register('user-form', Params.userForm);
  PM.register('event-form', Params.eventForm);
  PM.register('event-form-id', Params.eventFormId);
  PM.register('cover-photo', Params.coverPhoto);
  PM.register('add-host', Params.addHost);
  PM.register('add-activity', Params.addActivity);
  PM.register('activity-id', Params.activityId);
  PM.register('cover-photo-category', Params.coverPhotoCategory);
  PM.register('category-id', Params.categoryId);
  PM.register('photo-id', Params.photoId);
  PM.register('edit-host', Params.editHost);
  PM.register('host-invite-id', Params.hostInviteId);
  PM.register('edit-activity', Params.editActivity);
  PM.register('location', Params.location);
  PM.register('datetime', Params.datetime);
  PM.register('media', Params.media);
  PM.register('media-activity-id', Params.mediaActivityId);
  PM.register('media-id', Params.mediaId);
  PM.register('image-id', Params.imageId);
  PM.register('post-id', Params.postId);
  PM.register('add-guests-modal', Params.addGuestsModal);
  PM.register('add-guests-main-modal', Params.addGuestsMainModal);
  PM.register('add-guests-events-modal', Params.addGuestsEventsModal);
  PM.register('add-guests-outlook-modal', Params.addGuestsOutlookModal);
  PM.register('add-guests-twitter-modal', Params.addGuestsTwitterModal);
  PM.register('add-guests-tab', Params.addGuestsTab);
  PM.register('invite-preview', Params.invitePreview);
  PM.register('guest-id', Params.guestId);
  PM.register('group-id', Params.groupId);
  PM.register('group-modal', Params.groupModal);
  PM.register('msg-detail-modal', Params.EventsMessagesDetails);
  PM.register('msg-add-modal', Params.EventsMessagesAdd);
  PM.register('rsvp-yes', Params.rsvpYes);
  PM.register('rsvp-no', Params.rsvpNo);
  PM.register('rsvp-host', Params.rsvpHost);
  PM.register('share-prompt', Params.sharePrompt);
  PM.register('delete-prompt', Params.deletePrompt);
  PM.register('select-contacts', Params.selectContacts);
  PM.register('contact-support-form', Params.contactSupportForm);
  PM.register('event-add-media', Params.eventAddMedia);
  PM.register('add-co-host', Params.addCoHost);

  if (!Meteor.isCordova) {
    PM.register('add-guests-file-modal', Params.addGuestsFileModal);  
  }
  
});
   
Template.Events.onRendered(() => {
  
  Session.set('startingOverlayTemplate', false);

  Hoopla.setHeight({
        container: $(window),
        target: $('.contacts-collection'),
        offsets: [
          $('#add-guest-fixed-header'),
          $('.guests-tabs-row'),
        ],
          // clears the initially not rendered .add-guest-btn-wrapper-collection
          // and .location-serach-container divs
        padding: 130
      });

  if(Meteor.user().profile.userLang) {
    let langId = Meteor.user().profile.userLang;
    TAPi18n.setLanguage(langId);
    Session.set("currentLanguage",langId)
  } else {
    if(Session.get("currentLanguage") != 'undefined' && Meteor.userId()) {
      let langId = Session.get("currentLanguage");
      if(!langId) {
        langId = 'en';
      }
      TAPi18n.setLanguage(langId);
      let modifier = {$set: {
             'profile.userLang': langId
      }};
   
      Meteor.call('Users.update', Meteor.userId(),modifier);
    }
  }

  calendarSyncEventIntialTime();

   /*getAllEvents.upcoming.forEach(eventItem => 
   {
      let inviteEventData = Invites.findOne({eventId: eventItem._id,userId: Meteor.userId()});

      if(inviteEventData.isSyncCalendar)
      {
          deleteCalendarEvent(eventItem._id);
          calendarSyncEventIntialTime(eventItem._id);
      }

   });

   getAllEvents.past.forEach(eventItem => 
   {
      let inviteEventData = Invites.findOne({eventId: eventItem._id,userId: Meteor.userId()});

      if(inviteEventData.isSyncCalendar)
      {
          deleteCalendarEvent(eventItem._id);
          calendarSyncEventIntialTime(eventItem._id);
      }

   });  */

  setHeight();

  $(window).resize(_.debounce(setHeight, Hoopla.defaultInterval));

  Utils.fixSafariCannotScroll('.ea_event-listing');

  $("#add-guests-events-modal").css("display","none");
  $("#add-guests-outlook-modal").css("display","none");
  $("#add-guests-twitter-modal").css("display","none");

  PersonalContacts.init();
  
});

Template.Events.helpers({
  blankState () {
    let userId = Meteor.userId();
    Meteor.subscribe('events', userId);
    return !Events.find({creating: false}).count();
  },

  // shows until event ends
  // if no end shows until 2 hrs after event starts
  pendingRsvps (){
    let userId = Meteor.userId();
    let cutoff = moment().subtract(2, 'hours').toDate();

    let eventIds = Invites.find({
      userId, invited: true, replied: false, isHost: false
    }).map(invite => invite.eventId);

    return Events.find({
      _id: {$in: eventIds},
      creating: false,
      $or: [
        {eventStartTime: {$gt: cutoff}},
        {eventEndTime: {$gt: new Date()}},
      ],
    }, {
      sort: {eventStartTime: 1},
    }).fetch();
  },

  usersEvents (){
    const eventIds = Invites.find({
      userId: Meteor.userId()
    }).map(invite => invite.eventId);

    const events = Events.find({
      _id: {$in: eventIds}, creating: false
    },{ sort: { eventStartTime: 1 }}).fetch();
    const now = new Date();

    const [upcoming, past] = _(events).partition(event => {
      const {eventEndTime} = event;
      const latestStartTime = event.latestStartTime();

      if (eventEndTime && eventEndTime > latestStartTime) {
        return eventEndTime > now;

      } else {
        return moment(new Date(latestStartTime)).add(2, 'hours').toDate() >= now;
      }
    }).value();

    upcoming.forEach(event => event.isUpcoming = true);
    upcoming.reverse();
    past.reverse();
    return {upcoming, past};
  },

  overlayTemplate (){
    return Session.get('overlayTemplate');
  }
});

Template.Events.onDestroyed(() => {
  $(window).off('resize');
});

var setHeight = () => {

  Hoopla.setHeight({
    container: $(window),
    target: $('.ea_events-list'),
    offsets: [$(".events-logo")],
    padding: Meteor.isCordova ? 0 : 89,
  });
};


var getUserAllEvents = () => {
    
    const eventIds = Invites.find({
      userId: Meteor.userId()
    }).map(invite => invite.eventId);

    const events = Events.find({
      _id: {$in: eventIds}, creating: false
    }).fetch();

    const now = new Date();

    const [upcoming, past] = _(events).partition(event => {
      const {eventEndTime} = event;
      const latestStartTime = event.latestStartTime();

      if (eventEndTime && eventEndTime > latestStartTime) {
        return eventEndTime > now;

      } else {
        return moment(new Date(latestStartTime)).add(2, 'hours').toDate() >= now;
      }
    }).value();

    upcoming.forEach(event => event.isUpcoming = true);

    return {upcoming, past};
};

Template.Events.events({
  'click .first-event-btn, click .create-event-form-btn' (){
    Session.set('isEventEdit', null);
    $("#mySidenav").css("width","0");
    PM.set('event-form', true);
  },

  'click [data-event]': function(e, t) {
    var eventName;
    eventName = $(e.currentTarget).attr('data-event');
    return mixpanel.track(eventName);  
  },

  // 'click .h-btn-large': function(e, t) {
  //   console.log($(e.currentTarget).html());
  //   let tempVal = $(e.currentTarget).html();
  //   $(e.currentTarget).html('loading..');
  //   setTimeout(function() {
  //     $(e.currentTarget).html(tempVal);
  //   }, 2000);
  // }
});