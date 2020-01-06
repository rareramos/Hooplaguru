Package.describe({
  summary: "Facebook Connect package to connect facebook users to existing users."
});

Package.on_use(function (api) {
  api.use(['q42:microsoft@0.1.0'], ['client', 'server']);
  api.use(['accounts-password'], ['client', 'server']);

  //add dependency for overriding core
  api.use('oauth-encryption', 'server', {weak: true});
  api.use('oauth');

  api.add_files(["client.js"], 'client');
  api.add_files(["server.js"], 'server');
});
