Package.describe({
  name: 'hoopla:collections-and-schemas',
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
  var packages = [
    'erasaur:meteor-lodash',
    'reactive-var',
    'aldeed:simple-schema@1.3.2',
    'dburles:collection-helpers@1.0.3',
  ];

  api.versionsFrom('1.1.0.2');

  api.use(packages.concat([
    'mongo',
    'underscore@1.0.3',
    'ecmascript',
  ]));

  api.addFiles([
    'schemas/lib.js',
    'schemas/upload.js',
    'schemas/guest-form.js',
    'schemas/contact-support-form.js',
    'schemas/rsvp.js',
    'schemas/rsvp-code.js',
    'schemas/event-base.js',
  ]);

  api.addFiles([
    'collections/groups.js',
  ]);

  api.addFiles([
    'collections/messages.js',
  ]);

  api.addFiles([
    'collections/events.js',
    'collection-helpers/events.js',
    'collection-hooks/events.js',
  ]);

  api.addFiles([
    'collections/event-images.js',
    'collection-helpers/event-images.js',
    'collection-hooks/event-images.js',
  ]);

  api.addFiles([
     'collections/custom-location.js',
  ]);

  api.addFiles([
    'collections/invites.js',
    'collection-methods/invites.js',
    'collection-helpers/invites.js',
    'collection-hooks/invites.js',
  ]);

  api.addFiles([
    'collections/personal-contacts.js',
  ], 'client');

  api.addFiles([
    'server/indexes.js',
  ], 'server');

  api.imply(packages)

  api.export([
    'Schemas',
    'Events',
    'EventImages',
    'Groups',
    'Messages',
    'Invites',
    'CustomLocation'
  ]);

  api.export([
    'PersonalContacts',
  ], 'client');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('hoopla:collections-and-schemas');
  api.addFiles('collections-and-schemas-tests.js');
});
