Hoopla.associateSwipers = function(selector){
  var interval = setInterval(function(){
    var els = $(selector);

    if (els[0] && els[1] && els[0].swiper && els[1].swiper) {
      els[0].swiper.params.control = els[1].swiper;
      els[1].swiper.params.control = els[0].swiper;

      clearInterval(interval);
    }
  }, Hoopla.defaultInterval);
};
