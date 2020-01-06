Template.RsvpCard.helpers({
  themeCss (){
    if (this.theme === 'light'){
      let themeCss = {gradient: 'rgba(255, 255, 255, 0), rgba(255, 255, 255, .75)', color:'#000'}
      return themeCss;
    } else if (this.theme === 'dark') {
      let themeCss = {gradient: 'rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5)', color:'#fff'}
      return themeCss;
    }
  },
});

Template.RsvpCard.events({
  'click .rsvp-yes' (e){
    Utils.stopEvent(e);

    let guest = Invites.findOne({userId: Meteor.userId(), eventId: this._id});

    Meteor.call('rsvpReply', this._id, guest, {rsvp: true});

    PM.set('event-id', this._id);
  },

  'click .rsvp-no' (e){
    Utils.stopEvent(e);

    let guest = Invites.findOne({userId: Meteor.userId(), eventId: this._id});

    Meteor.call('rsvpReply', this._id, guest, {rsvp: false});

    PM.set('event-id', this._id);
  }
});
