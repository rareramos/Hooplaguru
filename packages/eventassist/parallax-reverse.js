Hoopla.parallaxReverse = function(params){
  params.partial.velocity('reverse');

  params.full.velocity('reverse', {
    complete: function(){
      if (params.complete) { params.complete() }
    }
  });
};
