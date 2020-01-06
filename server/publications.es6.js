Meteor.publishComposite('events', userId => {
  return {
    find (){
      return Invites.find({userId});
    },
    children: [{
      find (invite){
        return Events.find({_id: invite.eventId});
      },
      children: [{
        find (event){
          return Groups.find({eventId: event._id});
        },
      }, {
        find (event){
          return Activities.find({eventId: event._id});
        }
      }],
    }],
  };
});

Meteor.publishComposite('event', code => {
  return {
    find (){
      return Groups.find({code});
    },
    children: [{
      find (group){
        return Events.find({_id: group.eventId});
      },
      children: [{
        find (event){
          return Activities.find({eventId: event._id});
        },
      }],
    }],
  };
});

Meteor.publish('hosts', eventId => {
  return Invites.find({isHost: true, eventId});
});

Meteor.publish('cover-photo-categories', () => {
  return CoverPhotoCategories.find({});
});

Meteor.publish(null, () => {
  return Meteor.roles.find({});
});

Meteor.publish('activities', eventId => {
  return Activities.find({eventId});
}),

Meteor.publishComposite('posts', function(eventId, postLimit = 0){
  const user = Meteor.users.findOne({_id: this.userId})
  const userIsHost = user && user.isHost(eventId)
  const options = {sort: {createdAt: -1}, limit: postLimit}
  const {defaultName: botName} = Hoopla.bot

  return {
    find (){
      if (userIsHost) {
        return Posts.find({eventId}, options);

      } else {
        return Posts.find({eventId, userId: {$ne: botName}}, options);
      }
    },
    children: [{
      find (post){
        return Meteor.users.find({_id: post.userId}, {fields: {
          'profile.firstName': 1,
          'profile.lastName': 1
        }});
      },
    }, {
      find (post){
        return EventImages.find({postId: post._id,imageId: {$exists : true}});
      },
    }, {
      find (post){
        return Comments.find({postId: post._id});
      },
      children: [{
        find (comment){
          return Meteor.users.find({_id: comment.userId}, {fields: {
            'profile.firstName': 1,
            'profile.lastName': 1
          }});
        },
      }],
    }],
  };
});


Meteor.publishComposite('event-images', eventId => {
  //return EventImages.find({eventId});
  return {
    find (){
     return EventImages.find({eventId});
    },
    children: [{
      find (img){
        return Comments.find({imageId: img.imageId});
      },
      children: [{
        find (comment){
          return Meteor.users.find({_id: comment.userId}, {fields: {
            'profile.firstName': 1,
            'profile.lastName': 1
          }});
        },
      }],
    }, {
      find (img){
        return Posts.find({_id: img.postId});
      },
      children: [{
        find (post){
          return Meteor.users.find({_id: post.userId}, {fields: {
            'profile.firstName': 1,
            'profile.lastName': 1
          }});
        },
      }],
    }, {
      find (img){
        return Likes.find({imageId: img.imageId});
      },
      children: [{
        find (like){
          return Meteor.users.find({_id: like.userId}, {fields: {
            'profile.firstName': 1,
            'profile.lastName': 1
          }});
        },
      }],
    }],
  }
});

Meteor.publishComposite('guest-list', userId => {
  var d = Invites.findOne({userId,isHost:true});
  if(d && d._id)
  {
    return {
      find (){
        return Invites.find({userId,isHost:true});
      },
      children: [{
        find (invite){
          return Events.find({_id: invite.eventId});
        },
        children: [{
          find (event){
            return Invites.find({eventId: event._id});
          },
        }],
      }],
    };
  }
});

Meteor.publishComposite('guest-list-v2', userId => {
  var d = Invites.findOne({userId});
  if(d && d._id)
  {
    return {
      find (){
        return Invites.find({userId});
      },
      children: [{
        find (invite){
          return Events.find({_id: invite.eventId});
        },
        children: [{
          find (event){
            return Invites.find({eventId: event._id});
          },
        }],
      }],
    };
  }
});

Meteor.publish('messages', (eventId,userId) => {
  let msgs =  Messages.find({eventId: eventId,$or:[{toUser: userId},{fromUser: userId}]});
  return msgs;
});

Meteor.publish('custom-location', eventId => {
  return CustomLocation.find({eventId});
});


Meteor.publish('countries', function (query, options) {

  if (typeof query == 'undefined') query = {};
  if (typeof options == 'undefined') options = {};

  return Countries.find({},
    {fields: {_id:1,uid:1,cn_phone:1,cn_iso_2:1,cn_short_en:1,cn_short_en:1}});

});

Meteor.publish('countries-single', function (query) {

  if (typeof query == 'undefined') query = {};

  return Countries.find(query,
    {fields: {_id:1,uid:1,cn_phone:1,cn_iso_2:1}});

});


Meteor.publish('events-images-blank', () => {
  return EventImages.find({});
})
