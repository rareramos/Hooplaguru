Schemas.EventBase = new SimpleSchema({
  title: {
    type: String,
    label: 'Event Title',
  },
  description: {
    type: String,
    label: 'Description (optional)',
    optional: true,
    autoform: {
      afFieldInput: {
        type: 'textarea'
      }
    }
  },
  hostName: {
    type: String,
    label: 'Host Name',
  },
  isPlusOne: {
    type: Boolean,
    optional: true,
    label: 'Guests can invite a +1',
  },
});
