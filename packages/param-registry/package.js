Package.describe({
  name: 'hoopla:param-registry',
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
  api.versionsFrom('1.1.0.2');

  api.use('ecmascript');
  api.use('poetic:formaldehyde@0.1.3', 'client');
  api.use('velocityjs:velocityjs@1.2.1', 'client');

  api.addFiles([
    'lib.js',
    'params/event-nav.js',
    'params/event-nav-main.js',
    'params/event-id.js',
    'params/user-form.js',
    'params/contact-support-form.js',
    'params/event-form.js',
    'params/event-form-id.js',
    'params/cover-photo.js',
    'params/add-host.js',
    'params/add-activity.js',
    'params/activity-id.js',
    'params/cover-photo-category.js',
    'params/category-id.js',
    'params/photo-id.js',
    'params/edit-host.js',
    'params/host-invite-id.js',
    'params/edit-activity.js',
    'params/location.js',
    'params/datetime.js',
    'params/media.js',
    'params/media-activity-id.js',
    'params/media-id.js',
    'params/image-id.js',
    'params/post-id.js',
    'params/add-guests-modal.js',
    'params/add-guests-file-modal.js',
    'params/add-guests-main-modal.js',
    'params/add-guests-events-modal.js',
    'params/add-guests-outlook-modal.js',
    'params/add-guests-twitter-modal.js',
    'params/add-guests-tab.js',
    'params/invite-preview.js',
    'params/guest-id.js',
    'params/group-id.js',
    'params/group-modal.js',
    'params/msg-detail-modal.js',
    'params/msg-add-modal.js',
    'params/rsvp-yes.js',
    'params/rsvp-no.js',
    'params/rsvp-host.js',
    'params/photos-prompt.js',
    'params/share-prompt.js',
    'params/delete-prompt.js',
    'params/select-contacts.js',
    'params/event-add-media.js',
    'params/add-co-host.js',
  ], 'client');

  api.imply('poetic:formaldehyde@0.1.3', 'client');
  api.imply('velocityjs:velocityjs@1.2.1', 'client');

  api.export('PM', 'client');
  api.export('Params', 'client');
});
