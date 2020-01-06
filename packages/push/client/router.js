PushRouter = {};

PushRouter.route = notification => {
  Meteor.startup(() => {
    if (! notification.open) { return }

    const {route} = notification;

    if (PushRouter[route]) {
      PushRouter[route](notification);

    } else {
      PushRouter['defaultRoute'](notification);
    }
  });
};

PushRouter.event = ({payload}) => {
  Router.go('events');

  Meteor.setTimeout(() => {
    PM.set('event-nav', 0, true);
    PM.set('event-id', payload.eventId, true);
  }, 250);
};

PushRouter.defaultRoute = notification => (
  Router.go('/')
);
