Template.DateAndTime.helpers({
  currentActivity (){
    return Activities.findOne(Session.get('activityId'));
  },

  dateAndTimeSchema: function () {
    return SimpleSchema({
      startTime: {
        type: Date,
      },
      endTime: {
        type: Date,
        optional: true,
      },
      timeZone: {
        type: String,
        allowedValues: ['eastern', 'central', 'mountain', 'pacific'],
        autoform: {
          options: [
            {label: 'Eastern Time', value: 'eastern'},
            {label: 'Central Time', value: 'central'},
            {label: 'Mountain Time', value: 'mountain'},
            {label: 'Pacific Time', value: 'pacific'},
          ]
        }
      },
    });
  },
});

Template.DateAndTime.events({
  // handling this manually to prevent form flicker when autoform handles it
  'click #datetime-form-submit' (e){
    Utils.stopEvent(e);
    var formId = 'date-and-time-form';

    if (AutoForm.validateForm(formId)) {
      Meteor.call('updateActivity',
        PM.get('activity-id'), AutoForm.getFormValues(formId).updateDoc
      );

      Session.set('datetimeWarning', null);
      PM.set('datetime', null);
    }
  },
});
