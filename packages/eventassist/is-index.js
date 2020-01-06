Hoopla.isIndex = function(index){
  return (index || index === 0);
};

Hoopla.resolveWithIndex = function(sessionKey, prefix, suffix){
  var index = Session.get(sessionKey);

  if (Hoopla.isIndex(index)) {
    return prefix + index + suffix;
  }
};
