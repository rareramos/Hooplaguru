Hoopla.overlays = {
  handleFirst: function(value, template, begin, complete){
    if (value) {
      Session.set('firstOverlay', template)
      Hoopla.overlays.slideToFirst(begin, complete);
    } else {
      Hoopla.overlays.slideFromFirst();
    }
  },

  slideToFirst: function(begin, complete){
    var leftOffset = -($('.first-overlay').width());

    Hoopla.parallax({
      partial: $('.base-layer'), full: $('.first-overlay'),
      fullOffset: leftOffset,
      begin: begin,
      complete: complete,
    });
  },

  slideFromFirst: function(){
    Hoopla.parallaxReverse({
      partial: $('.base-layer'), full: $('.first-overlay'),
      complete: function(){
        Session.set('firstOverlay', null);
      }
    });
  },

  handleSecond: function(value, template, complete){
    if (value) {
      Session.set('secondOverlay', template)
      Hoopla.overlays.slideToSecond(complete);
    } else {
      Hoopla.overlays.slideFromSecond();
    }
  },

  slideToSecond: function(complete){
    var leftOffset = -($('.second-overlay').width());

    Hoopla.parallax({
      partial: $('.first-overlay'), full: $('.second-overlay'),
      partialOffset: leftOffset + Hoopla.parallaxOffset,
      fullOffset: leftOffset,
      complete: complete
    });
  },

  slideFromSecond: function(){
    Hoopla.parallaxReverse({
      partial: $('.first-overlay'), full: $('.second-overlay'),
      complete: function(){
        Session.set('secondOverlay', null);
      }
    });
  },
};
