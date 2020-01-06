Hoopla.formatActivityDate = function (startTime, endTime) {
  var start = moment(startTime).tz('UTC');
  var end   = moment(endTime).tz('UTC');

  if(!startTime) {
    return '';
  }

  if (!endTime) {
    return start.format('dddd, MMM D');
  }

  if (start.year() === end.year()) {
    if (start.month() === end.month()) {
      if (start.day() === end.day()) {
        return start.format('dddd, MMM D');

        // dates are on different days
      } else {
        return start.format('dddd, MMM D') + '-' + end.format('D');
      }

      // dates are in different months
    } else {
      return start.format('MMM D') + '-' + end.format('MMM D');
    }

    // dates are in different years
  } else {
    return start.format('MMM D YYYY') + '-' + end.format('MMM D YYYY');
  }
};

Hoopla.formatActivityTime = function (startTime, endTime) {
  if (! endTime) {
    let start = moment.tz(startTime, 'UTC');
    return start.format('h:mm a')
  }

  let start = moment.tz(startTime, 'UTC');
  let end   = moment.tz(endTime, 'UTC');
  return start.format('h:mm a') + '-' + end.format('h:mm a');
};

Hoopla.formatActivityTimeForCard = function (startTime, endTime) {
 if (! endTime) {
   let start = moment.tz(startTime, 'UTC');
   return start.format('h:mm a')
 }

 let start = moment.tz(startTime, 'UTC');
 let end   = moment.tz(endTime, 'UTC');

 if (start.year() === end.year()) {
   if (start.month() === end.month()) {
     if (start.day() === end.day()) {
       return start.format('h:mm a') + '-' + end.format('h:mm a');
     }
   }
 }     
 return '';
};
