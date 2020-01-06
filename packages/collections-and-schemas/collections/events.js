Events = new Mongo.Collection('events');


Events.attachSchema(new SimpleSchema({
  title: {
    type: String,
    optional: true,
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
  coverPhotoId: {
    type: String,
    optional: true,
  },
  blobCover: {
    type: String,
    optional: true,
  },
  isVideo: {
    type: Number,
    defaultValue: 0,
    optional: true,
  },
  isPlusOne: {
    type: Boolean,
    optional: true,
    label: 'Guests can invite a +1',
  },
  creating: {
    type: Boolean,
    defaultValue: true,
  },
  eventStartTime: {
    type: Date,
    optional: true
  },
  eventEndTime: {
    type: Date,
    optional: true
  },
  eventImageIds: {
    type: [String],
    defaultValue: [],
  },
  theme: {
    type: String,
    allowedValues: ['light', 'dark'],
    defaultValue: 'dark'
  },
  totalAttendingCount: {
    type: Number,
    optional: true,
    defaultValue: 0,
  },
  postsCount: {
    type: Number,
    optional: true,
    defaultValue: 0,
  },
  hideGuestList: {
    type: Boolean,
    optional: true,
    label: 'hide guest list',
  },
  publicEvent: {
    type: Boolean,
    optional: true,
    defaultValue: false,
  },
  createdAt: {
    type: Date,
    optional: true,
  },
  updatedAt: {
    type: Date,
    optional: true,
  },
  posterId: {
    type: String,
    optional: true,
  },
  saveAsDraft: {
    type: Boolean,
    optional: true,
    defaultValue: false,
  }
}));

Events.allow({
  'update': function (userId, doc) {
    // host can do anything
    return Events._transform(doc).isHost(userId);
  },
  'insert': function (userId, doc) {
    return true;
  },
})
