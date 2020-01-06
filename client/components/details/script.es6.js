Template.Details.onRendered(function(){
  this.find('.schedule-wrapper')._uihooks = {
    insertElement (node, next){
      $(node)
        .hide()
        .insertBefore(next)
        .velocity('fadeIn');
    }
  };
});

Template.Details.helpers({
  themeCss (){
    if (this.currentEvent) {
      let themeCss = {gradient: 'rgba(255, 255, 255, 0), rgba(255, 255, 255, .75)', color:'#000'};

      if (this.currentEvent.theme === 'dark') {
        themeCss = {gradient: 'rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5)', color:'#fff'}
      }

      return themeCss;
    }
  },

  canEditEvent (){
    if (this.currentEvent) {
      return Meteor.user().isHost(this.currentEvent._id);
    }
  },

  isPersonalMessages (){
    if (this) {
      return Meteor.user().isHost(this.eventId);
    }
  },

  hostTitle (){
    return TAPi18n.__("events.hosts");
  },
  scheduleTitle (){
    return TAPi18n.__("events.event_schedule");
  },
  removeBlankEventImages() {

    var allEventImage = EventImages.find({eventId:PM.get('event-id'),imageId: {$exists : false}}).fetch();
    console.log(allEventImage.length);

    if(allEventImage.length > 0) {
      allEventImage.forEach(function(image) {
        EventImages.remove(image._id);
      });
    }

  },
  checkisVideo() {

    if(this.currentEvent) {
      if(this.currentEvent.isVideo == 1) {
        return true;
      } else {
        return false;
      }
    }
  }
});

Template.Details.events({
  'click .activity-map' (){
    if (Meteor.isCordova && device) {
      if (isIOS(device)) {
        window.open(this.buildiOSMapLink(), '_system');
      } else {
        window.open(this.buildWebMapLink(), '_system');
      }
    } else {
      //window.open(this.buildWebMapLink(), '_system');
    }
  },

  'click .host-email-icon' (){
    window.open('mailto:' + this.email, '_system');
  },
  'click .host-persona-msg-icon' (){
    var msgUserArr = new Array();
    msgUserArr.push(this._id);
    PM.set('event-nav', null);
    PM.set('event-nav', 4, true);
    PM.set('msg-detail-modal', false);
    Session.set('msg-to-ids', msgUserArr);
  },
  'click .host-phone-icon' (){
    window.open('tel:' + this.phone, '_system');
  },

  'click .host-sms-icon' (){
    window.open('sms:' + this.phone, '_system');
  },

  'click #event-duplicate-btn' (event){
    event.stopPropagation();
    Meteor.call('duplicateEvent', this.currentEvent._id, (e, result) => {
      if (result) {
        Session.set('isEventEdit', true);
        PM.set('event-form-id', result);
        PM.set('event-form', true, true);

      } else {
        CrossPlatform.alert({
          msg: e.message,
          title: 'Resend Invite'
        });
      }
    });
  },

  'click .event-details-page .vide-play-image' (e, template){
    e.stopPropagation();
    e.preventDefault();
    var curretIds = this.currentEvent._id;
    var myVideo = $(".event-details-page #videoElements_"+this.currentEvent._id)[0];

    myVideo.onpause = function() {
      
      $(".event-details-page #img_"+curretIds).prop('src',"/images/icon-play.png");
    };

    if (myVideo.paused) {
      myVideo.play();
      $(".event-details-page #img_"+this.currentEvent._id).prop('src',"/images/icon-pause.png");  
    }
    else { 
      myVideo.pause(); 
      $(".event-details-page #img_"+this.currentEvent._id).prop('src',"/images/icon-play.png");  
    } 
  },
  
});

var isIOS = device => {
  return device.platform === 'iOS';
};

