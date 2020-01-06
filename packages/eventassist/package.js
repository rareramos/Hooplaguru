Package.describe({
  name: 'hoopla:hoopla',
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
  api.use('ecmascript');
  api.use('mongo', 'client');
  api.versionsFrom('1.1.0.2');

  api.addFiles('hoopla.es6.js');
  api.addFiles('lib.js');
  api.addFiles('set-height.js', 'client');
  api.addFiles('associate-swipers.js', 'client');
  api.addFiles('deregister-params.js', 'client');
  api.addFiles('transforms.es6.js', 'client');
  api.addFiles('parallax.js', 'client');
  api.addFiles('parallax-reverse.js', 'client');
  api.addFiles('autoresize-textarea.js', 'client');
  api.addFiles('is-index.js', 'client');
  api.addFiles('overlays.js', 'client');

  api.export([
    'Hoopla',
    'Utils',
    'PersonalContacts'
  ]);
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('hoopla:hoopla');
});
