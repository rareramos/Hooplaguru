Template.Loading.onCreated(function(){
 
});

Template.Loading.helpers({
  
  getStartingOverlay (){
    return Session.get('startingOverlayTemplate');
  },

  getLogoutSession (){
    return Session.get('getLogoutSession');
  },  

});

