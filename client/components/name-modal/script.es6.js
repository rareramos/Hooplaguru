Template.GetUsersName.events({
  'keyup #name-form' (){
    let firstName = $('#first-name').val();
    let lastName = $('#last-name').val();
    let status = firstName && lastName ? null : true;

    $('#name-submit').attr('disabled', status);
  },

  'submit #name-form' (e){
    Utils.stopEvent(e);

    $('#full-name').blur();
    Session.set('overlayTemplate', 'Loading');

    let modifier = {$set: {
      'profile.firstName': $('#first-name').val(),
      'profile.lastName': $('#last-name').val(),
    }};

    Meteor.call('Users.update', Meteor.userId(), modifier, (err, success) => {
      Session.set('overlayTemplate', null);

      if (success) { Router.go('events') }
    });
  },
});

//let blurInModal = template => {
  //Hoopla.transforms.showModal({
    //transition: 'blur',
    //blurTarget: '.homepage-bg',
    //complete (){
      //Session.set('overlayTemplate', template);
    //}
  //});
//};

//let hideNameModal = () => {
  //Session.set('overlayTemplate', null);

  //Hoopla.transforms.hideModal({
    //transition: 'blur',
    //blurTarget: '.homepage-bg',
  //});
//};
