var Twit = Meteor.npmRequire('twit');

Meteor.methods({
  attachUser (query, invite){
    check(query, Object);
    check(invite, Object);

    let user = Meteor.users.findOne(query);

    if (user) { return user }

    let userId = Accounts.createUser({
      email: invite.email,
      password: Meteor.uuid(),
      profile: {
        fullName: invite.name,
      }
    })

    return Meteor.users.findOne(userId);
  },

  customlocationlist (eventId, searchTerm) {
    let search = new RegExp(searchTerm);
    let activities = Activities.find({eventId: eventId,creating: false, 'address.locationName': search }, {sort: {'address.locationName': 1}}).fetch();

    var groupedData = _.groupBy(activities, 'address.locationName');
    let groupArr = Array();
     
    _.each(_.values(groupedData), function(data) {
        groupArr.push(data[0]);
    });

    return groupArr;
  },

  getTwitterAccessToken (userId){
    return Meteor.users.findOne({_id: userId}).services.twitter.accessToken;
  },

  getTwitterAccessSecret (userId){
    return Meteor.users.findOne({_id: userId}).services.twitter.accessTokenSecret;
  },


  getTwitterScreenName (userId){
    return Meteor.users.findOne({_id: userId}).services.twitter.screenName;
  },

  sendDirectMsg(to){

    var TMsg = new Twit({
      consumer_key:         Meteor.settings.public.TWITTER_CUSTOMER_KEY, // API key
      consumer_secret:      Meteor.settings.public.TWITTER_CUSTOMER_SECRET,
      access_token:         Meteor.users.findOne({_id: Meteor.userId()}).services.twitter.accessToken, 
      access_token_secret:  Meteor.users.findOne({_id: Meteor.userId()}).services.twitter.accessTokenSecret
    });

    TMsg.post('direct_messages/new',
      {
          screen_name: to,
          text: 'It\'s Just a test buddy.. :)'
      }
    );
  },

  getNameTwitter(id){

    var TMsg = new Twit({
      consumer_key:         Meteor.settings.public.TWITTER_CUSTOMER_KEY, // API key
      consumer_secret:      Meteor.settings.public.TWITTER_CUSTOMER_SECRET,
      access_token:         Meteor.users.findOne({_id: Meteor.userId()}).services.twitter.accessToken, 
      access_token_secret:  Meteor.users.findOne({_id: Meteor.userId()}).services.twitter.accessTokenSecret
    });

    var Tget = Meteor.wrapAsync(TMsg.get,TMsg);
    return Tget('users/show',
      {
          id: id,
          include_entities: false
      }).name;
  }
});
