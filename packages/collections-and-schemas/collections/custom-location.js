CustomLocation = new Mongo.Collection('custom-location');

CustomLocation.attachSchema(new SimpleSchema({
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
    optional: true
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
    type: String,
    optional: true,
  },
  eventId: {
    type: String
  }
}));

CustomLocation.allow({
    'insert': function (userId,doc) {
      /* user and doc checks ,
      return true to allow insert */
      return true; 
    }
  });