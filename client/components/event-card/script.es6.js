Template.EventCard.onRendered(function(){
  
});

Template.EventCard.helpers({
  themeCss (){
    if (this.theme === 'light'){
      let themeCss = {gradient: 'rgba(255, 255, 255, 0), rgba(255, 255, 255, .75)', color:'#000'}
      return themeCss;
    } else if (this.theme === 'dark') {
      let themeCss = {gradient: 'rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5)', color:'#fff'}
      return themeCss;
    }
  },

  eventStatusText (){
    if (! Meteor.user()) { return }

    let event = Events.findOne({_id: this._id});

    if (event && Meteor.user().isHost(this._id)) {
      let count = Events.findOne(this._id).totalAttendingCount;

      if (count === 1) {
        return `${count} `+TAPi18n.__('events.person_going');

      } else {
        return `${count} `+TAPi18n.__('events.people_going');
      }

    } else {
      let guest = Invites.findOne({
        userId: Meteor.userId(), eventId: this._id
      });

      if (guest && guest.inviteStatus === "attending") {
        return TAPi18n.__('events.im_going');

      } else {
        return TAPi18n.__('events.cant_make');
      }
    }
  },

  attendingThisEvent (){
    let guest = Invites.findOne({eventId: this._id, userId: Meteor.userId(), isHost: { $ne: true }});

    return guest && guest.inviteStatus === 'attending';
  },

  isHost (){
    return Meteor.user().isHost(this._id);
  },
  checkisVideo() {
    
    if(this.isVideo && this.isVideo == 1) {
      return true;
    } else {
      return false;
    }
  }
});

Template.EventCard.events({
  'click .event-duplicate-btn' (event){
    event.stopPropagation();
    Meteor.call('duplicateEvent', this._id, (e, result) => {
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
    })
  },

  'click .event-images-card .vide-play-image' (e, template){
    e.stopPropagation();
    e.preventDefault();
    
    var curretIds = this._id;
    $('video').each(function () {
      var getIds = this.id.split("_");
      if(curretIds != getIds[1]) {
        this.pause();
        this.currentTime = 0;
        $("#img_"+getIds[1]).prop('src',"/images/icon-play.png");
      }
    });
    
    var myVideo = document.getElementById("videoElements_"+this._id)

    myVideo.onpause = function() {
      
        $('video').each(function () {
          var getIds = this.id.split("_");
          if(curretIds == getIds[1]) {
            $("#img_"+getIds[1]).prop('src',"/images/icon-play.png");
          }
        });
    };
    if (myVideo.paused) {
      myVideo.play();
      $("#img_"+this._id).prop('src',"/images/icon-pause.png");  
    }
    else { 
      myVideo.pause(); 
      $("#img_"+this._id).prop('src',"/images/icon-play.png");  
    } 
  },
});
