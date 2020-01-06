Hoopla.setHeight = function(params){
  if (!params.padding) { params.padding = 0 }

  var offsets = params.offsets.reduce(function(total, current){
    return total + current.height();
  }, params.padding);

  if (_.isArray(params.target)) {
    params.target.forEach(setHeight);
  } else {
    setHeight(params.target);
  }

  function setHeight(selector){
    selector.height(params.container.height() - offsets);
  };
};
