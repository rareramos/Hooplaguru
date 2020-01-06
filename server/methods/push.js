Push.debug = true;

Push.allow({
    send: function(userId, notification) {
        return true; // Allow all users to send
    }
});

Meteor.methods({
    serverNotification: function(text,title) {
        var badge = 1
        Push.send({
            from: 'push',
            title: title,
            text: text,
            badge: badge,
            payload: {
                title: title,
                text:text
            },
            query: {
                // this will send to all users
            }
        });
    },
    userNotification: function(title,text,query,eventId = '') {
        check(title, String);
        check(text, String);
        check(query, Object);

        Push.send({
          from: 'HooplaGuru',
          title,
          text,
          payload: {
            title,
            text,
            eventId
          },
          query,
        });
        },
});