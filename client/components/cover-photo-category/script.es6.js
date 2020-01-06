Template.CoverPhotoCategory.helpers({
  categoryImageIds,

  image () {
    let image = {};
    image.imageId = this;
    return image;
  }
})

Template.CoverPhotoCategory.events({
  // NOTE: the context of this event is ImagePreview
  'click .card' (){
    // TODO: add dimention to event cover images
    let ids = categoryImageIds()
    let images = ids.map(function (id) {
      return {
        imageId: id,
        width:   Hoopla.photoSwipeSize,
        height:  Hoopla.photoSwipeSize,
      }
    })

    PhotoSwipe.initPhotoSwipe(images, {
      overlayTemplate: 'UseCoverPhoto',
      index: lodash.indexOf(ids, this.image.imageId.toString())
    })
  }
})

function categoryImageIds () {
  let category = CoverPhotoCategories.findOne(Session.get('category-id'))
  return (category && category.imageIds) || []
}
