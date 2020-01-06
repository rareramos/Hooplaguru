Template.SelectCoverPhoto.helpers({
  categories (){
    return CoverPhotoCategories.find({}, {sort: {name: 1}});
  },

  image () {
    let image = {};
    image.imageId = this.previewImageId;
    return image;
  }
});

Template.SelectCoverPhoto.events({
  'change #select-cover-photo-form' (event){
    let eventId = PM.get('event-form-id');
    const selectCoverPhotoForm = document.getElementById('select-cover-photo-form');
    
    EventImages.insertFromCoverFiles(
      event.target.files,
      eventId,
      (_id, blobImage) => {
        selectCoverPhotoForm.reset();
        PM.set('cover-photo', null);
      }
    );
  },

  /*'click .upload-input-btn' (event) {

    $(".cover-photos-file").click();
  }*/


});
