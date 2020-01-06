Hoopla.parallax = function(params){
  var partialOffset = params.partialOffset || Hoopla.parallaxOffset;

  params.partial.velocity({ translateX: partialOffset });

  params.full.velocity({
    translateX: params.fullOffset,
    begin: params.begin,
    complete: function(){
      if (params.complete) { params.complete() }
    }
  });
};
