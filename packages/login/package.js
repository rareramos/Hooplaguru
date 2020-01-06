Package.describe({
  name: 'hoopla:login',
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
  api.use('maxkferg:bitly@1.0.0');

  api.addFiles([
    'server/lib.js',
    'server/login-service.js',
    'server/methods.js'
  ], 'server');

  api.export('LoginService', 'server');

  api.imply('maxkferg:bitly@1.0.0');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('hoopla:login');
  api.addFiles('login-tests.js');
});
