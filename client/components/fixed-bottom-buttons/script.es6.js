Template.FixedBottomButtons.helpers({
  hideButtons(){
    return Session.get('hideButtons');
  },
});

Template.FixedBottomButtons.events({
  'click .user-form-btn-inner' (){
    //PM.set('user-form', true);
    $("#mySidenav").css("width","300px");
  },
});
