Schemas.Upload = new SimpleSchema({
  file: {
    type: String,
    optional: true,
    autoform: {
      afFieldInput: {
        type: 'fileUpload',
      }
    }
  }
});
