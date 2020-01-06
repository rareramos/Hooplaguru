Schemas.GuestForm = new SimpleSchema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  emailOrPhone: {
    type: String,
    optional: true,
  },
});
