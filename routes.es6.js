Router.route('/', {
  name: 'index'
});

Router.route('/login', {
  name: 'login',
  fastRender: true
});

Router.route('/events', {
  name: 'events',
  fastRender: true
});

Router.route('/admin', {
  name: 'admin'
});

Router.route('/:groupCode/:firstName', {
  name: 'event',
});

Router.route('/api/webhooks/marketing', function(){
  this.response.writeHead(200);
  this.response.end('')
}, {where: 'server'});


Router.route('/api/webhooks/email-status', function(){
  Emails.dispatchMandrillWebhook(this.request);

  this.response.writeHead(200);
  this.response.end('')
}, {where: 'server'});

if (Meteor.isCordova) {
  Meteor.startup(function () {
    // handle custom scheme or universal links
    window.handleOpenURL = function (url) {
      let path = url.replace(Hoopla.urlScheme.base, '/');
      Utils.loginAndRedirect(path);
    }
  })
}