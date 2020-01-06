Accounts.onLogin(function () {
  if (!Hoopla.haveBeenWalkedThrough.get()) {
    Hoopla.haveBeenWalkedThrough.set();
  }
})

Template.Login.onCreated(function(){
  Session.set('loginTemplate', 'PhoneForm');

  this.firstTime = !Hoopla.haveBeenWalkedThrough.get() && Meteor.isCordova
  if (this.firstTime) {
    this.swiperOptions = {
      pagination: '.swiper-pagination',
      paginationClickable: true,
    };
  }
});

Template.Login.onRendered(function(){
  if (this.firstTime) {
    new Swiper('.login-swiper', this.swiperOptions);
  }
});

Template.Login.helpers({
  overlay (){
    return Session.get('overlayTemplate');
  },

  loginTemplate (){
    return Session.get('loginTemplate');
  },

  firstTime (){
    return Template.instance().firstTime && Meteor.isCordova;
  },
});

Template.Login.onDestroyed(() => {
  Session.set('loginTemplate', null);
});
