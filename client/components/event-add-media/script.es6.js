Template.eventAddMedia.onCreated(function(){
	this.addPhoto = new ReactiveVar(0);
	this.formUploadError = new ReactiveVar();

  $("#imageActivity").select2({
      placeholder: "General",
      allowClear: true
  });

  $("#videoActivity").select2({
      placeholder: "General",
      allowClear: true
  });
});

Template.eventAddMedia.helpers({
	s2Opts: function () {
		let activityList = Activities.find({eventId:Session.get('eventId')}).fetch();
		if (!activityList)
		  return [];

		let list = [];
		// it'll only come here after the subscription is ready, no .fetch required
		
		_.forEach(activityList, function(item){
		    //process item
		    list.push({label: item.title,value:item._id});

		});
        return list;
  },

  mediaBtnTxt: function () {
  	if(Template.instance().addPhoto.get() == 0) {
  		return TAPi18n.__('photos.add_images');
  	} else {
  		return TAPi18n.__('photos.add_video');
  	}
  },

  formUploadError (){
    return Template.instance().formUploadError.get();
  },
  addMediaTitle() {
    return TAPi18n.__('photos.add_media');
  }
});

Template.eventAddMedia.events({
  'click #add-images' (evt, template){
  	template.addPhoto.set(0);
		if(!$(event.target).hasClass('active-photos')) {
		  $(event.target).addClass('active-photos');
		  $("#add-videos").removeClass('active-videos');

      const photosForm = document.getElementById('event-photos-form');
      photosForm.reset();
      $("#imageActivity").val([]).trigger('change');
      template.formUploadError.set(null);
		  $("#add-photo-form-container").show();
		  $("#add-video-form-container").hide();
		} 
  },

  'click #add-videos' (evt, template){
  	template.addPhoto.set(1);
		if(!$(event.target).hasClass('active-videos')) {
		  $(event.target).addClass('active-videos');            
		  $("#add-images").removeClass('active-photos');

      const videosForm = document.getElementById('event-videos-form');
      videosForm.reset();
      $("#videoActivity").val([]).trigger('change');
      template.formUploadError.set(null);
		  $("#add-video-form-container").show();
		  $("#add-photo-form-container").hide();
		}
  },

  'click .left-header-icon' (evt, template){
    const photosForm = document.getElementById('event-photos-form');
    const videosForm = document.getElementById('event-videos-form');
    photosForm.reset();
    videosForm.reset();
    $("#imageActivity").val([]).trigger('change');
    $("#videoActivity").val([]).trigger('change');  
  	
	  PM.set('event-add-media', null);
  },

  'click #add-media-btn' (evt, template){

  	var addPhotos = template.addPhoto.get();
  	template.formUploadError.set(null);
    var cameraPhoto = $("#choose-camera-img").attr("src");

  	if(addPhotos == 0) {
  		var fileList = document.getElementById("upload-field").files;
  		var activityList = $("#imageActivity").val();
  	} else {
  		var fileList = document.getElementById("upload-field-video").files;
  		var activityList = $("#videoActivity").val();
  	}
  
  	if(fileList.length == 0) {
  		return template.formUploadError.set(TAPi18n.__('photos.upload_error'));
  	}

   	EventImages.insertFromFiles(
	    fileList,
	    Session.get('eventId'),activityList,'photo',
    );

   	const photosForm = document.getElementById('event-photos-form');
    const videosForm = document.getElementById('event-videos-form');
  	photosForm.reset();
    videosForm.reset();
    $("#imageActivity").val([]).trigger('change');
    $("#videoActivity").val([]).trigger('change');
  	PM.set('event-add-media', null);
  	 //return mixpanel.track("Photo Uploaded.");
   },

});
