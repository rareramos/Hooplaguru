Hoopla.autoResizeTextArea = function(selector){
  var hiddenDiv = $('.hiddendiv');
  hiddenDiv.css('width', selector.width());

  selector.each(function(){
    var el = $(this);
    var content;

    if (el.val().length) {
      content = el.val();
      content = content.replace(/\n/g, '<br>');

      hiddenDiv.html(content + '<br>');
      el.css('height', hiddenDiv.height());
    }
  });
};
