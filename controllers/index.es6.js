IndexController = ApplicationController.extend({
  onBeforeAction (){
    if (Meteor.userId()) {
      this.redirect('events');

    } else {
      this.redirect('login');
    }
  }
});
