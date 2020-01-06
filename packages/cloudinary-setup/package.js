Package.describe({
  name: 'hoopla:cloudinary-setup',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use('jquery');
  api.use('ecmascript');
  api.use('lepozepo:cloudinary');
  api.addFiles('client/setup.js', 'client');
  api.addFiles('client/custom-upload.js', 'client');
  api.addFiles('server/setup.js', 'server');
  api.export('Cloudinary');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('cloudinary-setup');
  api.addFiles('cloudinary-setup-tests.js');
});
