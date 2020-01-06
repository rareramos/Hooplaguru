postList = ()  => {
  let post;
  if(Session.get('postId')) {
    post = Posts.findOne(Session.get('postId'));
  } else {
    let imgData = EventImages.findOne({imageId:Session.get('imageId')});

    if(imgData && imgData.postId) {
      post = Posts.findOne(imgData.postId);
    } else {
      post = imgData;
    }
  }
  return post;
}

likepic = (imageId) => {
  
  let like = Likes.findOne({imageId: imageId, userId: Meteor.userId()});
  if(!Session.get('isLiking')) {
    if(like) {
      Meteor.call('removeLike',like._id,(err, success) => {
        Session.set('isLiking',false);
      })
    } else {
      Meteor.call('insertLike',{imageId: imageId, userId: Meteor.userId()}, (err, success) => {
        Session.set('isLiking',false);
      })
    }
  }
}

loadingtext = (element) => {
  /*let temptext = element.text();
  element.text('Loading...');
  setTimeout(function() {
    element.text(temptext);
  }, 1000);*/
}

setCountryCode = (uid,code)  => {
    
  $(".checkbox-icon-coutrycode").attr('src','/icons/form-checkbox-off@2x.png');
  $(".icon-code-"+uid).attr('src','/icons/form-checkbox-on@2x.png');
  Session.set('currentCountryCode', uid); 
  $(".selected-coutry-code").val('+'+code);
}

searchCountry = (data)  => {

  var srchTerm = data.value, 
        $rows = $(".coutrycodelist").children("li");
    if (srchTerm.length > 0) {
        $rows.stop().hide();
        $(".coutrycodelist").find("li:contains('" + srchTerm + "')").stop().show();
    } else {
        $rows.stop().show();
    }  
}

$.expr[":"].contains = $.expr.createPseudo(function(arg) {
    return function( elem ) {
        return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
    };
});
