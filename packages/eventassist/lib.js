Utils = {};

Utils.numbers = string => {
  if (! string) { return '' }
  return string.replace(/\D/g,'');
};

Utils.addCountrySign = string => {
  if (! string) { 
    return '' 
  } else if (string.length === 10) {
    return string;
  } else {
    return '+'+string;
  }
  
};


Utils.numbersFrom = selector => {
  return Utils.numbers($(selector).val());
};

Utils.stripUSCountryCode = string => {
  const numberString = Utils.numbers(string)

  //if (numberString.length === 11) {
    //return numberString.substr(1)

  //} else 

  if (numberString.length) {
    return numberString

  } else {
    return ''
  }
}

Utils.randomCode = length => {
  if (! length) { return '' }
  return Meteor.uuid().replace(/-/g, '').substr(0, length);
};

Utils.formatPhone = phone => {
  if (phone.length === 10) {
    let areaCode = phone.substr(0, 3);
    let prefix = phone.substr(3, 3);
    let suffix = phone.substr(6, 4);

    return `(${areaCode}) ${prefix}-${suffix}`;

  } else {
    return phone;
  }
};

Utils.formatCallPhone = phone => {
  if (phone.length === 10) {
    let areaCode = phone.substr(0, 3);
    let prefix = phone.substr(3, 3);
    let suffix = phone.substr(6, 4);

    return `1-${areaCode}-${prefix}-${suffix}`;

  } else {
    return phone;
  }
};

Utils.stopEvent = e => {
  e.preventDefault();
  e.stopPropagation();
};

Utils.buildMapUrl = (address, {width, height}) => {
  let {googleApiUrl, googleApiKey} = Meteor.settings.public;

  return (
    `${googleApiUrl}?markers=${address}&size=${width}x${height}&key=${googleApiKey}`
  );
};

  // http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport/7557433#7557433
Utils.isElementInViewport = el => {
  //special bonus for those using jQuery
  if (typeof jQuery === "function" && el instanceof jQuery) {
    el = el[0];
  }

  var rect = el.getBoundingClientRect();

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
    rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
  );
};

Utils.scrollTo = ({target, container, duration = 250}) => {
  target.velocity('scroll', {
    container, duration
  });
};


Utils.capitalizeAll = (string) => {
  return (string || '').split(' ').map(lodash.capitalize).join(' ');
};

/*
 * @param url {string|Array}
 */
Utils.shareImage = (url, callback = ()=>{}) => {
  let canShare = Meteor.isCordova && window.plugins.socialsharing;
  if (!canShare) {
    return;
  }

  Session.set('overlayTemplate', 'Loading');
  setTimeout(() => {
    window.plugins.socialsharing.share(
      null, null, url, null,
      success => {
        Session.set('overlayTemplate', null);
        callback()
      },
      error => {
        Session.set('overlayTemplate', null);
        CrossPlatform.alert({msg: error.message})
        callback()
      }
    );
  }, 500);
}

Utils.shareMessage = (msg, callback = ()=>{}) => {
  let canShare = Meteor.isCordova && window.plugins.socialsharing;
  if (!canShare) {
    return;
  }

  Session.set('overlayTemplate', 'Loading');
  setTimeout(() => {
    window.plugins.socialsharing.share(
      msg, null, null, null,
      success => {
        Session.set('overlayTemplate', null);
        callback()
      },
      error => {
        Session.set('overlayTemplate', null);
        CrossPlatform.alert({msg: error.message})
        callback()
      }
    );
  }, 500);
}

Utils.openApp = function (path) {
  // this only works for iOS8, not iOS9
  // for iOS9 we need the universal link
  let appUrl = Hoopla.urlScheme.base + path

  $('<iframe />')
    .attr('src', appUrl)
    .attr('style', 'display:none;')
    .appendTo('body');

  window.addEventListener('pagehide', preventPopup);

  function preventPopup() {
    window.removeEventListener('pagehide', preventPopup);
  }
}

Utils.fixSafariCannotScroll = function(selector) {
  // bugfix: in mobile safari, sometime we can not scroll when first land on
  // the home page
  let display = $('.ea_event-listing').css('display');
  $('.ea_event-listing').css('display', 'none');
  setTimeout(function () {
    $('.ea_event-listing').css('display', display);
  })
}

Utils.convertToUTC = function (time) {
  let timeInString = moment(time).format('dddd, MMM D YYYY, h:mm a');
  return moment.tz(timeInString, "UTC").toDate();
}

Utils.loginAndRedirect = function (path, {onError, onSuccess} = {}) {
  let loginTokenSegments = path.match(/login-token=([a-zA-Z0-9_-]+)/);
  let loginToken         = loginTokenSegments && loginTokenSegments[1];
  let absolutePath       = path.replace(/^https?:\/\/[^/]+/, '');

  if (loginToken) {
    Meteor.loginWithToken(loginToken, function (error) {
      if (error) {
        CrossPlatform.alert({msg: error.message})
        if (onError) { onError() }
      } else {
        if (onSuccess) {
          onSuccess(() => window.location.href = absolutePath)
        } else {
          window.location.href = absolutePath;
        }
      }
    })
  } else {
    window.location.href = absolutePath;
  }
}

