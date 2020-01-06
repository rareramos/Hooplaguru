let _ = lodash

SimpleSchema.messages({
  'end-time-early':  '[label] should be later than Start time',
  'start-time-required': 'Start time is requied before you can specify End time',
})

let AddressSchema = new SimpleSchema({
  locationName: {
    type: String,
    optional: true,
  },
  address1: {
    type: String,
    optional: true,
  },
  address2: {
    type: String,
    optional: true,
  },
  city: {
    type: String,
    optional: true,
  },
  state: {
    type: String,
    optional: true,
  },
  zipCode: {
    type: Number,
    optional: true,
    autoform: {
      type: 'number'
    }
  }
});

Activities = new Mongo.Collection('activities');

Activities.attachSchema(new SimpleSchema({
  title: {
    type: String,
    label: 'Activity Title',
    optional: true
  },
  attire: {
    type: String,
    label: 'Attire / Dress Code (optional)',
    optional: true,
    autoform: {
      afFieldInput: {
        type: 'textarea'
      }
    }
  },
  transit: {
    type: String,
    label: 'Transit / Parking (optional)',
    optional: true,
    autoform: {
      afFieldInput: {
        type: 'textarea'
      }
    }
  },
  startTime: {
    type: Date,
    optional: true,
  },
  endTime: {
    type: Date,
    optional: true,
    custom: function () {
      if (!this.isSet) {
        return
      }

      let startTime = ((this.field('startTime') && this.field('startTime').value)) ||
        this.docId && Activities.findOne(this.docId).startTime;
      if (!startTime) {
        return 'start-time-required';
      }

      let endTime = this.value;
      if (endTime != null && startTime >= endTime) {
        return 'end-time-early';
      }
    },
  },
  timeZone: {
    type: String,
    allowedValues: ['eastern', 'central', 'mountain', 'pacific'],
    optional: true
  },
  address: {
    type: AddressSchema,
    optional: true,
  },
  notes: {
    type: String,
    optional: true,
    autoform: {
      afFieldInput: {
        type: 'textarea'
      }
    }
  },
  eventId: {
    type: String,
    optional: true
  },
  creating: {
    type: Boolean,
    optional: true,
    defaultValue: true,
  },
}));

Activities.helpers({
  addressLine3 (){
    if (this.address) {
      city = this.address.city;
      state = this.address.state;
      zipCode = this.address.zipCode;

      var addressStrings = _.compact([city, state, zipCode]);

      return addressStrings.join(', ');
    }
  },

  calendarLocation (){
    return (this.address && this.address.locationName) || '';
  },

  calendarNotes (){
    return (this.notes || this.attire || this.transit);
  },

  buildiOSMapLink (){
    let locationString = _.compact([
      this.address.address1,
      this.address.address2,
      this.addressLine3()
    ]).join(' ');

    if (locationString) {
      let queryString = encodeURIComponent(locationString);
      return `http://maps.apple.com/?q=${queryString}`;
    }
  },

  buildAndroidLink (){
    var queryString;

    var locationString = _.compact([
      this.address.address1,
      this.address.address2,
      this.addressLine3()
    ]).join(' ');

    if (locationString) {
      queryString = encodeURIComponent(locationString);
      return `http://www.google.com/maps/place/${queryString}`;
    }
  },

  buildWebMapLink (){
    var queryString;

    var locationString = _.compact([
      this.address.address1,
      this.address.address2,
      this.addressLine3()
    ]).join(' ');

    if (locationString) {
      queryString = encodeURIComponent(locationString);
      return `http://www.google.com/maps/place/${queryString}`;
    }
  },

  buildMapUrl ({width = 1000, height = 1000} = {}){
    if (! this.address) { return }

    return Utils.buildMapUrl(
      encodeFullAddress(this.address), {width, height}
    );
  },
});

ActivityBaseSchema = new SimpleSchema({
  title: {
    type: String,
    label: 'Activity Title',
  },
  attire: {
    type: String,
    label: 'Attire / Dress Code (optional)',
    optional: true,
    autoform: {
      afFieldInput: {
        type: 'textarea'
      }
    }
  },
  transit: {
    type: String,
    label: 'Transit / Parking (optional)',
    optional: true,
    autoform: {
      afFieldInput: {
        type: 'textarea'
      }
    }
  },
  notes: {
    type: String,
    optional: true,
    autoform: {
      afFieldInput: {
        type: 'textarea'
      }
    }
  },
});

ActivityAddressSchema = new SimpleSchema({
  'address.locationName': {
    type: String,
    optional: true,
  },
  'address.address1': {
    type: String,
    optional: true,
  },
  'address.address2': {
    type: String,
    optional: true,
  },
  'address.city': {
    type: String,
    optional: true,
  },
  'address.state': {
    type: String,
    optional: true,
  },
  'address.zipCode': {
    type: String,
    optional: true,
  }
});

if (Meteor.isServer) {
  //Activities.before.update(setDefaultEndTime);

  Activities.after.insert(saveEventTime);
  Activities.after.update(saveEventTime);
  Activities.after.remove(function (userId, doc) {
    // update event only if the event still exist
    if (doc.eventId && Events.findOne(doc.eventId)) {
      saveEventTime(userId, doc)
    }
  });

  function setDefaultEndTime (userId, doc, fieldNames, modifier) {
    if (!modifier.$set) {
      return
    }

    let {startTime}     = modifier.$set
    let currentEndTime  = modifier.$set.endTime
    let previousEndTime = doc.endTime

    let shouldSetEndTime = startTime && !currentEndTime && !previousEndTime
    if (!shouldSetEndTime) {
      return
    }

    modifier.$set.endTime = moment(startTime).add(2, 'hours').toDate()
  }

  function saveEventTime (userId, {eventId, creating}) {
    if (creating) { return false }

    const activities = Activities.find({eventId, creating: false}).fetch();
    const modifier = {$set: {
      eventStartTime: _(activities).map('startTime').min()
    }};
    const endTimes = _(activities).map('endTime').compact().value();

    if (endTimes.length) {
      modifier.$set.eventEndTime = _(endTimes).max();
    }

    Events.update({_id: eventId}, modifier)
  }
}
