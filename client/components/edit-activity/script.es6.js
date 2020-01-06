Template.EditActivity.helpers({
  currentActivity (){
    return Activities.findOne(Session.get('activityId'));
  },

  editMode (){
    return Session.get('editMode');
  },

  editDataEvent (){
    if(Session.get('editMode')) {
      return "Activity Edited.";
    } else {
      return "Activity Added.";
    }
  },

  datetimeWarning (){
    return Session.get('datetimeWarning');
  },

  locationWarning (){
    return Session.get('locationWarning');
  },
  titleWarning (){
    
    return Session.get('titleWarning');
  },
  activityTitle (){
    return TAPi18n.__("activity_add.activity_title");
  },

  dressCodeTitle (){
    return TAPi18n.__("activity_add.dress_code");
  },
  parkingTitle (){
    return TAPi18n.__("activity_add.parking");
  },
  notesTitle (){
    return TAPi18n.__("activity_add.notes");
  }

});

Template.EditActivity.events({
  'click .target-add': _.debounce(e => {
    $('.target-add').css('display', 'none');
    var activityCard = $(e.target).parent();
    var moreDetails = activityCard.parent().find('.activity-more-details');
    moreDetails.show();
    var totalHeight = moreDetails[0].scrollHeight;

    $.Velocity(moreDetails,
      {height: totalHeight}, {duration: Hoopla.velocityDuration,easing: "ease-in-out"}
    );
  }, Hoopla.velocityDuration, true),

  'click #location-row' (){
    PM.set('location', true);
  },

  'click #media-row' (){
    PM.set('media', true);
  },

  'click #update-activity' (e){
    Utils.stopEvent(e);
    resetWarnings();

    var formValid = AutoForm.validateForm('edit-activity-form');
    var datetimeValid = validateDatetime();
    var activityTitleValid = validateActivityTitle();
    var locationValid = validateLocation();
    var activityParam, update;

    if (formValid && datetimeValid && locationValid && activityTitleValid) {  
      update = AutoForm.getFormValues('edit-activity-form').updateDoc;
      update.$set.creating = false;
      loadingtext($(e.target));
      Meteor.call('Activities.update',PM.get('activity-id'), update);

      activityParam = PM.get('add-activity') ? 'add-activity' : 'edit-activity';
      PM.set(activityParam, null);
    } 
  },

  'click #delete-activity-btn' (){
    if (Meteor.isCordova && navigator.notification) {

      var buttonIndex = ''
      var onConfirm = function(buttonIndex) {
        if (buttonIndex === 2) {
          Meteor.call('deleteActivity',
            PM.get('activity-id'), PM.get('event-form-id')
          );

          PM.set('edit-activity', null);
        }
      }

      var deleteActivityConfirm = function() {
        navigator.notification.confirm(
          TAPi18n.__("activity_add.delete_activity_confirm"),
          onConfirm,
          TAPi18n.__("activity_add.delete_activity_title"),
          ['Cancel','OK']
        )
      }

      deleteActivityConfirm();

    } else {
      if (window.confirm(TAPi18n.__("activity_add.delete_activity"))) {
        
        Meteor.call('deleteActivity',
        PM.get('activity-id'), PM.get('event-form-id')
        );

        PM.set('edit-activity', null);
      }
    }
  },

  'click #start-time-row' (){
    let eventActivity = Activities.findOne({_id: PM.get('activity-id')});
    
    $('.datepicker').pickadate({
      onOpen (){
        $('#datepicker-form').css('z-index', 10000);
        let settings = {
          'clear': null,
          'min': new Date(),
        }

        settings.highlight = new Date(moment(eventActivity.startTime).tz('UTC').format('dddd, MMM D YYYY, h:mm a'));
        settings.view = new Date(moment(eventActivity.startTime).tz('UTC').format('dddd, MMM D YYYY, h:mm a'));
        
        this.set(settings, { muted: true });
      },
      onSet (){   
        
        let date = this.get('select');

        if (date && date.obj) {
          startTimepicker(date.obj, 'startTime');
          setTimeout(() => $('#time-picker').focus(), 1);
        } else {
          let modifier = {$set: {startTime: null}};
          Meteor.call('Activities.update', Session.get('activityId'), modifier);
        }
      },
      onClose (){
        $('#datepicker-form').css('z-index', -10000);
        this.stop();
      },
    });

    setTimeout(() => $('#date-picker').focus(), 1);
  },

  'click #end-time-row' (){
    let eventActivity = Activities.findOne({_id: PM.get('activity-id')});

    $('.datepicker').pickadate({
      onOpen (){
        $('#datepicker-form').css('z-index', 10000);
        let settings = {
          'clear': null,
          'min': new Date(),
        }
          settings.highlight = new Date(moment(eventActivity.endTime).tz('UTC').format('dddd, MMM D YYYY, h:mm a'));
          settings.view = new Date(moment(eventActivity.endTime).tz('UTC').format('dddd, MMM D YYYY, h:mm a'));
        
        this.set(settings, { muted: true });
      },
      onSet (){
        let date = this.get('select');

        if (date && date.obj) {
          startTimepicker(date.obj, 'endTime');
          setTimeout(() => $('#time-picker').focus(), 1);
        } else {
          let modifier = {$set: {endTime: null}};
          Meteor.call('Activities.update', Session.get('activityId'), modifier);
        }
      },
      onClose (){
        $('#datepicker-form').css('z-index', -10000);
        this.stop();
      },
    });

    setTimeout(() => $('#date-picker').focus(), 1);
  },
});

let startTimepicker = function(date, key){
  
  let event = Events.findOne({_id: Session.get('eventFormId')});
  let eventActivity = Activities.findOne({_id: PM.get('activity-id')});


  $('.timepicker').pickatime({
    onOpen (){
      
      $('#datepicker-form').css('z-index', 10000);
      this.set('clear', null);
      let coeff = 1000 * 60 * 30;
      if(key == 'startTime') {
        this.set('view', new Date(moment(eventActivity.startTime).tz('UTC').format('dddd, MMM D YYYY, h:mm a')));
        this.set('highlight', new Date(moment(eventActivity.startTime).tz('UTC').format('dddd, MMM D YYYY, h:mm a')));
      } else {
        this.set('view', new Date(moment(eventActivity.endTime).tz('UTC').format('dddd, MMM D YYYY, h:mm a')));
        this.set('highlight', new Date(moment(eventActivity.endTime).tz('UTC').format('dddd, MMM D YYYY, h:mm a')));
      }
      
    },
    onSet (){
      let time = this.get('select');
      let modifier = {$set: {}};

      if (time && (time.pick || time.pick === 0)) {
        date.setHours(time.hour);
        date.setMinutes(time.mins);

        let newDate = date; 
        date = Utils.convertToUTC(date);

        modifier.$set[key] = date;
        
        Meteor.call('Activities.update', Session.get('activityId'), modifier, function (e) {
          e && CrossPlatform.alert({msg: e.message.replace(' [400]','.'),title:'Error'});

          if(key == 'startTime')
          {
             newDate.setHours(time.hour + 1)
             newDate = Utils.convertToUTC(newDate);
             modifier.$set['endTime'] = newDate; 

             Meteor.call('Activities.update', Session.get('activityId'), modifier, function (e) {
              e && CrossPlatform.alert({msg: e.message.replace(' [400]','.'),title:'Error'})
            });
          }
          
        });

        this.close();
      }
    },
    onClose (){
      $('#datepicker-form').css('z-index', -10000);
      this.stop();
    }
  });
};

var resetWarnings = () => {

  Session.set('datetimeWarning', null);
  Session.set('locationWarning', null);
  Session.set('titleWarning', null);
};

var validateDatetime = () => {
  var activity = Activities.findOne(PM.get('activity-id'));

  if (activity.startTime) {
    return true;

  } else {
    Session.set('datetimeWarning', true);
    return false;
  }
};

var validateActivityTitle = () => {
  var title = $('#activityTitle').val();

  if (title != '') {
    return true;

  } else {
    Session.set('titleWarning', true);
    return false;
  }
};

var validateLocation = () => {
  var activity = Activities.findOne(PM.get('activity-id'));

  if (activity.address && (activity.address.locationName || activity.address1)) {
    return true;

  } else {
    Session.set('locationWarning', true);
    return false;
  }
};

//let onOpen = function(){
  //$('#datepicker-form').css('z-index', 10000);
  //this.set('clear', null);
//};
