Template.Comment.helpers({
  originalPost: function () {
  	let imgId;
  	if(this.postId) {
	    post = EventImages.findOne({postId:this.postId});
      if(post) {
  	    imgId = post.imageId;
      }
  	} else {
  		imgId = this.imageId;
  	}	
  	return EventImages.findOne({imageId: imgId});
  },
})
