/**
 * @param images Array|Object
 *   imageId
 *   width
 *   height
 * @param options Object
 */

PhotoSwipe.initPhotoSwipe = (images, options) => {
  if (! _.isArray(images)) { images = [images] }

  check(images, Array)
  check(options, Object)

  let element = document.querySelectorAll('.pswp')[0];

  let imageItems = images.map((image) => {

    if(image.isVideo == 1)
    {
        const width = image.width;
        const height = image.height;
        /*return {
          html:'<video controls="" poster="http://hooplabucket.s3-website-us-east-1.amazonaws.com'+image.imageId+'" class="velocity-animating pswp-video"><source src="http://hooplabucket.s3-website-us-east-1.amazonaws.com'+image.imageId+'" type="video/mp4"></video>',
          w: width,
          h: height,
        }*/
        return {
          html:$.cloudinary.video(image.imageId, { controls: true, class: 'velocity-animating pswp-video'}),
          w: width,
          h: height,
        }  
    }
    else
    {
        const blob = image.blob;
        const width = image.width;
        const height = image.height;
        const src = blob ? blob : 

        $.cloudinary.url(image.imageId, {width, height, crop: 'fit'});

        if (Meteor.isCordova && src === blob) {
          const orientation = image && image.orientation;

          if (orientation === 6 || orientation === 8){
            return {
              src,
              w: height ,
              h: width ,
            }
          }
        }
        
        return {
          src,
          w: width,
          h: height,
        }
    }
  });

  let settings = _.extend(
    {index: 0, history: false, tapToToggleControls: false},
    options
  );

  if (settings.overlayTemplate) {
    Session.set('photoSwipeOverlay', settings.overlayTemplate);
    delete settings.overlayTemplate;
  }
  
  let gallery = new PhotoSwipe(element, PhotoSwipeUI_Default, imageItems, settings);

  gallery.listen('afterInit', () => {
    if (PM.get('show-comment-form')) {
      Session.set('showCommentForm', true);
    }
  });

  gallery.listen('destroy', () => {
    if (PM.get('post-id')) {
      PM.set('post-id', null);
    }

    if (PM.get('image-id')) {
      PM.set('image-id', null);
    }

    if (PM.get('show-comment-form')) {
      PM.set('show-comment-form', null, true);
    }

    if (Meteor.isCordova && screen.lockOrientation) {
      screen.lockOrientation('portrait');
    }

    Session.set('showCommentForm', null);
    Session.set('photoSwipeOverlay', null);

    delete gallery;
  });

  if (Meteor.isCordova && screen.unlockOrientation) {
    screen.unlockOrientation();
  }

  gallery.init();

  gallery._getCurrentImageId = function () {
    let index = gallery.getCurrentIndex();
    return images[index]['imageId'];
  }

  gallery.listen('afterChange', function() { PM.set('image-id', this._getCurrentImageId()); });

  PhotoSwipe._singleton = gallery;
};