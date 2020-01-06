/*
 * routes
 *   - email
 *   - push
 *   - sms
 */
MessageBus = function(){
  const API = {};
  const blacklistedKeys = ['error', 'sendall'];
  let registry = [];

  const findRegistration = name => (
    registry.find(registration => registration.name === name)
  );

  const findRoute = (name, routes) => (
    Object.keys(routes).find(routeName => routeName === name)
  );

  const respond = (successRoute, successValue, sendAll) => {
    if (! successRoute || _.isEmpty(successRoute)) {
      return {error: 'Message could not be sent'};
    }

    if (sendAll) {
      return {
        sendAll: _.object(successRoute, successValue)
      };

    } else {
      return {[`${successRoute}`]: successValue};
    }
  };

  API.register = (name, routes) => {
    if (blacklistedKeys.includes(name.toLowerCase())) {
      throw new Error(`"${name}" cannot be used as a message type.`);
    }

    if (! findRegistration(name)) {
      registry = [
        ...registry, {name, routes}
      ];

    } else {
      throw new Error(`${name} is already registered as a message type`);
    }
  };

  API.send = (name, message, {sendAll} = {}) => {
    const registration = findRegistration(name);
    if (!registration) {
      throw new Meteor.Error('not-registered', `${name} is not registered as a message type`);
    }

    const {routes} = registration;

    // when sendAll is false, we will try all of the routes one by one until we success
    // when sendAll is true, we send to all of them
    const response = Object.keys(routes).reduce(function (previousResponse, route) {
      if (!message[route]) {
        return previousResponse;
      }

      const skipThisRoute = previousResponse.success && !sendAll;
      if (skipThisRoute) {
        return previousResponse;
      }

      try {
        previousResponse.routes[route] = Meteor.call(routes[route], message[route]);
        previousResponse.success = true;
      } catch (e) {
        console.error(e.stack && e.stack.stack);
      }

      return previousResponse;
    }, {success: false, routes: {}});

    return response.success;
  };

  return API;
};

MsgBus = MessageBus();
