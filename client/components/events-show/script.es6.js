Template.EventsShow.onCreated(function(){
  GoogleMaps.load({libraries: 'places',key:'AIzaSyDFQoeoAwBQTlbuWF9Adh1RvjngxPS8iFo'});
});

Template.EventsShow.onRendered(() => {

  $(window).resize(_.debounce(() => {
    setPlanningSlidesHeight();
    setEventFormHeight();
  }, Hoopla.defaultInterval));
});

Template.EventsShow.helpers({
  isPlanner (){
    let eventId = Session.get('eventId');

    if (eventId) {
      return (Meteor.user().isHost(eventId));
    }
  },

  mediaOverlay (){
    return Session.get('mediaOverlay');
  },

  overlayTemplate (){
    return Session.get('overlayTemplate');
  },

  currentEvent (){
    return Events.findOne(Session.get('prefetchEventId'));
  },
});

Template.EventsShow.events({
  'click #event-form-btn' (e){
    Session.set('isEventEdit', true);
    PM.set('event-form-id', Session.get('eventId'));
    PM.set('event-form', true, true);
  },

  'click .important-wrapper' (){
    if (Session.get('isImportantPost')) {
      Session.set('isImportantPost', null);

    } else {
      Session.set('isImportantPost', true);
    }

    $('.post-field-input').focus();
  },

  'click .event-back-btn' (){
    PM.set('event-id', null);
  },
});

Template.EventsShow.onDestroyed(() => {
  Session.set('showSubmit', null);
  Session.set('showSoftSubmit', null);
  Session.set('isImportantPost', null);
  $(window).off('resize');
});

var scrollToBottom = () => {
    // wait a bit for new message status to change, then scroll
  var newPost = $('.wall-posts li').last();
  newPost.velocity('scroll', {container: $('.wall-posts')});
};

var setEventFormHeight = () => {
  Hoopla.setHeight({
    container: $(window),
    target: $('.event-form-slide'),
    offsets: [$('.event-form-nav')],
    padding: 0
  });
};

var setPlanningSlidesHeight = () => {
  Hoopla.setHeight({
    container: $(window),
    target: $('.swiper-container-short'),
    offsets: [],
    padding: 50
  });
};
