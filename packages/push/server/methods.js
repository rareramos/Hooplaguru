Meteor.methods({
  'Server.Push.send' ({title, text, query}){
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
      },
      query,
    });
  }
});
