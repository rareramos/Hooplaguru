Template.Location.onCreated(function(){
  this.nearbyResults = new ReactiveVar();
  this.showForm = new ReactiveVar();
  this.customlocation = new ReactiveVar();
  GoogleMaps.load({libraries: 'places',key:'AIzaSyDFQoeoAwBQTlbuWF9Adh1RvjngxPS8iFo'});
});

Template.Location.onRendered(function(){
  var interval = setInterval(() => {
    if (GoogleMaps.loaded()) {
      this.service = new google.maps.places.PlacesService(
        document.getElementsByClassName('hiddendiv')[0]
      );

      clearInterval(interval);
    }
  }, Hoopla.defaultInterval);

  eventId = Activities.findOne({_id: PM.get('activity-id')}).eventId;
 
  Meteor.call('customlocationlist', eventId, '', (e, result) => {
     this.customlocation.set(result);  
  });
});

Template.Location.helpers({
  nearbyResults (){
    var results = Template.instance().nearbyResults.get();

    if (results && results.length) { return results }
  },

  showForm (){
    return Template.instance().showForm.get();
  },

  currentActivity (){
    return Activities.findOne(PM.get('activity-id'));
  },
  customlocation (){
    var results = Template.instance().customlocation.get();
 
    if (results && results.length) { return results } else { return false; }
  },
  locationTitle (){
    return TAPi18n.__("activity_add.add_location.location");
  },
  address1Title (){
    return TAPi18n.__("activity_add.add_location.address1");
  },
  address2Title (){
    return TAPi18n.__("activity_add.add_location.address2");
  },
  cityTitle (){
    return TAPi18n.__("activity_add.add_location.city");
  },
  stateTitle (){
    return TAPi18n.__("activity_add.add_location.state");
  },
  zipcodeTitle (){
    return TAPi18n.__("activity_add.add_location.zipcode");
  },

});

Template.Location.events({
  keyup: _.debounce((evt, template) => {
    $('.custom-nearby-result').hide();
    var searchTerm = evt.target.value;
    var bounds;

    if (searchTerm.length) {
      Meteor.call('customlocationlist', eventId,searchTerm, (e, result) => {
         template.customlocation.set(result);  
      });

      bounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(84, -179),
        new google.maps.LatLng(-84, 179)
      );

      template.service.textSearch({
        query: searchTerm,
        bounds: bounds,
        rankBy: google.maps.places.RankBy.DISTANCE
      }, nearbyResults(template));

      // mock empty response from google
    } else { 
       
      Meteor.call('customlocationlist', eventId,'', (e, result) => {
         template.customlocation.set(result);  
      });
 
      nearbyResults(template)([], 'OK') }
  }, Hoopla.keyupDebounce),

  'click #add-location-prompt' (evt, template){
    template.showForm.set(true);
  },

  'focus #search' (evt, template){
    template.showForm.set(false);
  },

  'click .nearby-result' (){
    var update = {$set: {
        // google returns results only for these fields
      'address.locationName': this.name,
      'address.address1': this.formatted_address,

        // blank these out in case they were previously set by the user
      'address.address2': '',
      'address.city': '',
      'address.state': '',
      'address.zipCode': ''
    }};

    Meteor.call('Activities.update', PM.get('activity-id'), update);
    navBack();
  },

  'click .custom-nearby-result' (){
    var update = {$set: {
        
      'address.locationName': this.address.locationName,
      'address.address1': this.address.address1,
      'address.address2': this.address.address2 ? this.address.address2 : '',
      'address.city': this.address.city ? this.address.city : '',
      'address.state': this.address.state ? this.address.state : '',
      'address.zipCode': this.address.zipCode ? this.address.zipCode : ''
    }};
 
    Meteor.call('Activities.update', PM.get('activity-id'), update);
    navBack();
   },

  'click #address-form-submit' (e){
    Utils.stopEvent(e);
    var formId = 'address-form';

    if (AutoForm.validateForm(formId)) {
      let modifier = AutoForm.getFormValues(formId).updateDoc;
      loadingtext($(event.target));
      Meteor.call('Activities.update', PM.get('activity-id'), modifier, (e, result) => {
         if(!e) {
           let customlocation = AutoForm.getFormValues(formId).insertDoc.address;
           customlocation.eventId = Activities.findOne({_id: PM.get('activity-id')}).eventId;
           
           Meteor.subscribe('custom-location',customlocation.eventId);
 
           if(CustomLocation.find({locationName: customlocation.locationName,eventId: customlocation.eventId}).count() == 0)
           {
             CustomLocation.insert(customlocation,function(error, postId) {
               if (error) {
                 CrossPlatform.alert({msg: error});
                 return
               }
             });
           }
         }
      });
      navBack();
    }
  }
});

var nearbyResults = function(template){
  return (results, status) => {
    if (status === 'OK') {
      template.nearbyResults.set(results);
    }
  };
};

var navBack = () => {
  Session.set('locationWarning', null);
  PM.set('location', null);
};
