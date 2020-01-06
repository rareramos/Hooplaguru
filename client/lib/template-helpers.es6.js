Template.registerHelper('formatPhone', phone => {
  return Utils.formatPhone(phone);
});

Template.registerHelper('isCordova', () => {
  return Meteor.isCordova;
});

Template.registerHelper('hooplaAppStoreUrl', () => {
  return Hoopla.appStoreUrl;
});

Template.registerHelper('hooplaGooglePlayUrl', () => {
  return Hoopla.googlePlayUrl;
});

Template.registerHelper('log', context => {
  console.log(context);
});

Template.registerHelper('withIndex', items => {
  if (items) {
    return items.map((item, index) => {
      item.index = index;
      return item;
    });
  }
});

Template.registerHelper('formatDateInUTCWithToken', (datetime, token) => {
  if (datetime) {
    return moment(datetime).tz('UTC').format(token);
  }
});

Template.registerHelper('isTouchDevice', () => {
  return "ontouchstart" in window || window.DocumentTouch && document instanceof DocumentTouch;
});

Template.registerHelper('formatActivityDate', (startTime, endTime) => {
  return Hoopla.formatActivityDate(startTime, endTime)
});

Template.registerHelper('formatActivityTimeForCard', (startTime, endTime) => {
  return Hoopla.formatActivityTimeForCard(startTime, endTime)
});

Template.registerHelper('formatActivityTime', (startTime, endTime) => {
  return Hoopla.formatActivityTime(startTime, endTime)
});

Template.registerHelper('linkify', inputText => {

   var replacedText, replacePattern1, replacePattern2, replacePattern3;

   //URLs starting with http://, https://, or ftp://
   replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
   replacedText = inputText.replace(replacePattern1, '<a href="#" onclick="window.open(\'$1\', \'_system\');" style="text-decoration: underline;">$1</a>');

   //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
   replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
   replacedText = replacedText.replace(replacePattern2, '$1<a href="#" onclick="window.open(\'http://$2\', \'_system\');" style="text-decoration: underline;">$2</a>');

   //Change email addresses to mailto:: links.
   replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
   replacedText = replacedText.replace(replacePattern3, '<a href="#" onclick="window.open(\'mailto:$1\', \'_system\');" style="text-decoration: underline;">$1</a>');
   replacedText = replacedText.replace(/(\r\n|\n|\r)/gm, '<br/>');

   return new Spacebars.SafeString(replacedText);  
});

Template.registerHelper('breakLines', text => {
  var escaped = s.escapeHTML(text);
  escaped = escaped.replace(/(\r\n|\n|\r)/gm, '<br/>');

  return new Spacebars.SafeString(escaped);
});

initResizeInterval = function(){
  var template = this;

  var interval = setInterval(function(){
    if (template.$('.swiper-slide-main')[0]) {
      Hoopla.setHeight({
        container: $(window),
        target: template.$('.swiper-slide-main'),
        offsets: [$('.navbar')],
        padding: 1
      });

      clearInterval(interval);
    }
  }, Hoopla.defaultInterval);
};

encodeFullAddress = function(address){
  var addressParts = [
    address.address1, address.city,
    address.state, address.zipCode
  ];

  if (address.address2) {
    addressParts.splice(1, 0, address.address2);
  }

  return encodeURIComponent(addressParts.join(' '));
};
