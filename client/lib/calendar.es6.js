PersonalCalendar = {
  addEvents (eventTitle, schedule){
    var success = () => {
      var msg = `${eventTitle} has been added to your calendar.`
      if (Meteor.isCordova && navigator.notification) {

        navigator.notification.alert(
            msg,
            function (){},
            'HooplaGuru',
            'Dismiss'
        );
      } else {
        alert(msg);
      }
    };

    var calendarItems = schedule.map(activity => {
      var item = {
        title:     activity.title,
        startTime: activity.startTime,
        endTime:   activity.endTime,
        location:  activity.calendarLocation(),
        notes:     activity.calendarNotes(),
      };

      if (! item.endTime) {
        item.endTime = moment(item.startTime).add(1, 'hour').toDate();
      }

      return item;
    });

    if (Meteor.isCordova && window.plugins.calendar) {
      calendarItems.forEach(item => {
        window.plugins.calendar.createEvent(
          item.title, item.location,
          item.notes, item.startTime,
          item.endTime, function(){}, function(){}
        );
      });
    }

    success();
  }
};
