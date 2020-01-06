AdminController = ApplicationController.extend({
  loadingTemplate: 'Loading',

  onBeforeAction (){
    if (Meteor.userId()) {
      this.next();

    } else {
      this.redirect('/');
    }
  },

  waitOn (){
    return Meteor.subscribe('cover-photo-categories');
  },

  data (){
    return {
      categories (){
        return CoverPhotoCategories.find({}, {sort: {name: 1}});
      },
    }
  },
});

var userHasRole = (role) => {
  var user = Meteor.users.findOne(Meteor.userId());

  return user && user.roles && _.contains(user.roles, role);
};
