Schemas.Rsvp = new SimpleSchema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  phone: {
    type: String,
    regEx: SimpleSchema.RegEx.Phone,
    autoform: {
      type: 'tel'
    },
  }
});
