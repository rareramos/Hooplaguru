Package.describe({
  name: 'hoopla:push',
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

  api.use('ecmascript');
  //api.use('raix:push@2.6.12');

  //api.addFiles('lib.js');

  //api.addFiles([
    //'client/router.js',
    //'client/listeners.js',
  //], 'client');

  //api.addFiles('server/methods.js', 'server');

  //api.imply('raix:push@2.6.12');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('hoopla:push');

  api.addFiles('push-tests.js');
});
