CoverPhotoCategories = new Mongo.Collection('cover-photo-categories');

CoverPhotoCategories.attachSchema(new SimpleSchema({
  name: {
    type: String
  },
  previewImageId: {
    type: String,
  },
  imageIds: {
    type: [String],
  },
}));
