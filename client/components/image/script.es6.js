


let defaultImageOptions = {
  width: 500,
  height: 500,
  crop: 'fit'
};

lodash.each(['width', 'height', 'crop'], function (attrName) {
  let helpers = {};
  helpers['_' + attrName] = function () {
    return (this.imageOptions && this.imageOptions[attrName]) || defaultImageOptions[attrName];
  };

  Template.Image.helpers(helpers);
});

Template.Image.helpers({
  imageSrc() {
    
    const image = this.image;

    if (this.imageId) {
      return $.cloudinary.url(this.imageId, { width: defaultImageOptions.width, height: defaultImageOptions.height, crop: defaultImageOptions.crop });
    } else if (image && image.imageId) {
      return $.cloudinary.url(image.imageId, { width: defaultImageOptions.width, height: defaultImageOptions.height, crop: defaultImageOptions.crop });
    } else if (image && image.coverPhotoId && image.coverPhotoId != ' ') {
      return $.cloudinary.url(image.coverPhotoId, { width: this.width, height: this.height, crop: this.crop });
    } else if (image && image.blob) {
      return image.blob;
    } else if (image && image.blobCover) {
      return image.blobCover;
    } 
  },
  dataId() {
    const image = this.image;

    if (this.imageId) {
      return this.imageId;
    } else if (image && image.imageId) {
      return image.imageId;
    } else if (image && image.coverPhotoId && image.coverPhotoId != ' ') {
      return image.coverPhotoId;
    } else if (image && image.blob) {
      return image.blob;
    } else if (image && image.blobCover) {
      return image.blobCover;
    }
  },
  _style() {
    let defaultStyle = "object-fit:cover;";
    return  this.style || defaultStyle;
  },
  _className() {
    return this.className || 'card-image-bg';
  },
  isVideo(){
    
    if(this.image) {
      if(this.image.isVideo == 1) {
        return true;
      } else {
        return false;
      }
    }
  },
  userVideo()
  {
    const image = this.image;

    if(image.coverPhotoId) {

      return $.cloudinary.video(image.coverPhotoId, { controls: false, id: 'videoElements_'+image._id, class: 'getVideo'});
    } else if(image.imageId) {
      
      return $.cloudinary.video(image.imageId, { controls: true,});
    } else {
      return false;
    }
  },

});

Template.Image.events({

});

