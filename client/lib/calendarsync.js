
calendarSyncEvent = (isSyncCalendar,eventId) => {

  if (Meteor.isCordova) {

    let currentActivity = Activities.find({eventId: eventId, creating: false}).fetch();
    let currentEvent = Events.findOne({_id: eventId});
    
    var successmain = function(message) { };
    var errormain = function(message) { };
     

    if(isSyncCalendar) {
                   
      currentActivity.forEach(item => {
        TimeZoned.getTimeZoneForAddress(item.address.address1, function (error, succ) {
          var getstartUTC = moment.tz(item.startTime,'UTC');
          var getendUTC = moment.tz(item.endTime,'UTC');

          var getstartZone = moment.tz(item.startTime,succ);
          var getendZone = moment.tz(item.endTime,succ);

          getstartZone.hours(getstartUTC.hours()).minutes(getstartUTC.minutes()).date(getstartUTC.date()).month(getstartUTC.month()).year(getstartUTC.year());
          getendZone.hours(getendUTC.hours()).minutes(getendUTC.minutes()).date(getendUTC.date()).month(getendUTC.month()).year(getendUTC.year());

          Meteor.call('createdEventDeepLinkForCalendar', currentEvent._id, (e, linkresult) => {
            var startDate = moment(getstartZone).local().toDate(); 
            var endDate = moment(getendZone).local().toDate();
            
            var title = currentEvent.title+', Hosted By '+currentEvent.hostName();
            var eventLocation = item.address.address1;
            var notes = item.title+`\n View Event Details: `+linkresult;

            var calOptions = window.plugins.calendar.getCalendarOptions();  
            calOptions.firstReminderMinutes = 120; 
            calOptions.secondReminderMinutes = 5;

            calOptions.calendarName = "HooplaGuru";
            calOptions.url = linkresult; 

            window.plugins.calendar.createEventWithOptions(title,eventLocation,notes,startDate,endDate,calOptions,successmain,errormain);
          });
        });      
      });    
    } else {
        deleteCalendarEvent(eventId);   
    }

  }
}

calendarSyncEventIntialTime = () => {
  
  if (Meteor.isCordova) 
  {
    var successmain = function(message) { };
    var errormain = function(message) { };

    deleteCalendarFull();

    let getAllEvents = getUserAllEventsForCalendar(); 
    Meteor.setTimeout(() => {
      window.plugins.calendar.createCalendar("HooplaGuru",function(succ,err) {
         
          if(succ) {
             getAllEvents.forEach(eventItem => 
             {
                let inviteEventData = Invites.findOne({eventId: eventItem._id,userId: Meteor.userId()});
                if(inviteEventData.isSyncCalendar)
                {
                    let currentActivity = Activities.find({eventId: eventItem._id, creating: false}).fetch();

                    currentActivity.forEach(item => {

                      TimeZoned.getTimeZoneForAddress(item.address.address1, function (error, succ) {

                          var getstartUTC = moment.tz(item.startTime,'UTC');
                          var getendUTC = moment.tz(item.endTime,'UTC');

                          var getstartZone = moment.tz(item.startTime,succ);
                          var getendZone = moment.tz(item.endTime,succ);

                          getstartZone.hours(getstartUTC.hours()).minutes(getstartUTC.minutes()).date(getstartUTC.date()).month(getstartUTC.month()).year(getstartUTC.year());
                          getendZone.hours(getendUTC.hours()).minutes(getendUTC.minutes()).date(getendUTC.date()).month(getendUTC.month()).year(getendUTC.year());

                          Meteor.call('createdEventDeepLinkForCalendar', eventItem._id, (e, linkresult) => {
                            
                            var startDate = moment(getstartZone).local().toDate(); 
                            var endDate = moment(getendZone).local().toDate();

                            var title = eventItem.title+', Hosted By '+eventItem.hostName();
                            var eventLocation = item.address.address1;
                            var notes = item.title+` View Event Details: `+linkresult;

                            var calOptions = window.plugins.calendar.getCalendarOptions();  
                            calOptions.firstReminderMinutes = 120; 
                            calOptions.secondReminderMinutes = 5;
                            calOptions.calendarName = "HooplaGuru";
                            calOptions.url = linkresult; 

                            window.plugins.calendar.createEventWithOptions(title,eventLocation,notes,startDate,endDate,calOptions,successmain,errormain);

                          });
                      });
                    });
                }
             }); 
          }
      });
    }, 2000);
  }
}

deleteCalendarEvent = (eventId) => {

  if (Meteor.isCordova) 
  {
    let currentActivity = Activities.find({eventId: eventId, creating: false}).fetch();
    let currentEvent = Events.findOne({_id: eventId});
     
    var successmain = function(message) { console.log('succ');console.log(message);};
    var errormain = function(message) { console.log('err');console.log(message);};
  
    currentActivity.forEach(item => { 
        TimeZoned.getTimeZoneForAddress(item.address.address1, function (error, succ) {
 
            var getstartUTC = moment.tz(item.startTime,'UTC');
            var getendUTC = moment.tz(item.endTime,'UTC');

            var getstartZone = moment.tz(item.startTime,succ);
            var getendZone = moment.tz(item.endTime,succ);

            getstartZone.hours(getstartUTC.hours()).minutes(getstartUTC.minutes()).date(getstartUTC.date()).month(getstartUTC.month()).year(getstartUTC.year());
            getendZone.hours(getendUTC.hours()).minutes(getendUTC.minutes()).date(getendUTC.date()).month(getendUTC.month()).year(getendUTC.year());

            var startDate = moment(getstartZone).local().toDate(); 
            var endDate = moment(getendZone).local().toDate();

            var title = currentEvent.title+', Hosted By '+currentEvent.hostName();
            var eventLocation = item.address.address1;
            
            window.plugins.calendar.deleteEventFromNamedCalendar(title,eventLocation,startDate,endDate,"HooplaGuru",successmain,errormain);
            window.plugins.calendar.deleteEvent(title,eventLocation,startDate,endDate,successmain,errormain);
        });  
    });
  
  }

}

deleteCalendarFull = () => {
  var successmain = function(message) { };
  var errormain = function(message) { };
  window.plugins.calendar.deleteCalendar('HooplaGuru',successmain,errormain);
}


var getUserAllEventsForCalendar = () => {
    
    const eventIds = Invites.find({
      userId: Meteor.userId()
    }).map(invite => invite.eventId);

    const events = Events.find({
      _id: {$in: eventIds}, creating: false
    }).fetch();

    const now = new Date();

    const [upcoming, past] = _(events).partition(event => {
      const {eventEndTime} = event;
      const latestStartTime = event.latestStartTime();

      if (eventEndTime && eventEndTime > latestStartTime) {
        return eventEndTime > now;

      } else {
        return moment(new Date(latestStartTime)).add(2, 'hours').toDate() >= now;
      }
    }).value();

    upcoming.forEach(event => event.isUpcoming = true);
    var data = upcoming.concat(past);
    console.log(data);
    return data;
};
